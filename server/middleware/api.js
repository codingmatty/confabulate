const { Router } = require('express');
const passport = require('passport');
const firebaseAdmin = require('../firebase-admin');
const {
  generateAuthUrl,
  getContactsFromCode
} = require('../utils/google-contacts-auth');

module.exports = function registerApi(db) {
  const router = new Router();

  router.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('custom', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (info.code === 'no-account') {
          return res.redirect('/signup');
        }
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  // Require authentication for all following routes
  router.use((req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      next();
      return;
    }
    res.status(401).redirect('/login');
  });

  router.get('/google-contacts-auth', (req, res) => {
    const authUrl = generateAuthUrl({ email: req.user.email });
    res.redirect(authUrl);
  });

  router.get('/callback/google-contacts', async (req, res) => {
    const { user } = req;
    const { code } = req.query;

    // Clear temporarily stored google contacts first
    await db.GoogleContacts.deleteMany(user.id);

    const googleContacts = await getContactsFromCode(code);

    // Query for duplicate contacts that were fetched from google
    const existingContacts = await db.Contacts.getAll(user.id, {
      $or: [
        {
          'source.id': {
            $exists: true,
            $in: googleContacts.map(({ peopleId }) => peopleId)
          }
        },
        {
          email: {
            $exists: true,
            $in: googleContacts.map(({ email }) => email)
          }
        },
        {
          phoneNumber: {
            $exists: true,
            $in: googleContacts.map(({ phoneNumber }) => phoneNumber)
          }
        }
      ]
    });

    // Filter google contacts from existing contacts based on email, phone, and common ID
    const filteredContacts = googleContacts.filter(
      (contact) =>
        !existingContacts.some(
          ({ source = {}, email, phoneNumber }) =>
            (source.id && contact.peopleId === source.id) ||
            (email && contact.email === email) ||
            (phoneNumber && contact.phoneNumber === phoneNumber)
        )
    );

    // Temporarily save new google contacts
    await db.GoogleContacts.create(user.id, filteredContacts);

    res.status(200).end();
  });

  router.get('/logout', (req, res) => {
    firebaseAdmin.auth().revokeRefreshTokens(req.user.uid);
    req.logout();
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/login');
    });
  });

  return router;
};
