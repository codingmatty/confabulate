const { Router } = require('express');
const passport = require('passport');
const CustomStrategy = require('passport-custom');
const firebaseAdmin = require('../firebase-admin');

module.exports = function registerPassport(db) {
  const router = new Router();

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await db.getUser(userId);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new CustomStrategy(async (req, done) => {
      // Use a custom strategy to verify Firebase JWT and pass it to serializer
      try {
        const { idToken } = req.body;
        const decodedIdToken = await firebaseAdmin
          .auth()
          .verifyIdToken(idToken);
        const user = await db.getUser(decodedIdToken.uid);
        if (user) {
          done(null, user);
        } else {
          done(null, false, { code: 'no-account' });
          // Sign up user
          // db.addUser(decodedIdToken.uid, {
          //   email: decodedIdToken.email,
          //   authProviders: [decodedIdToken.firebase.sign_in_provider]
          // });
          // done(null, idToken);
        }
      } catch (error) {
        done(error);
      }
    })
  );

  router.use(passport.initialize());
  router.use(passport.session());

  router.use((err, req, res, next) => {
    if (err) {
      // If an error has occured, then logout and redirect
      if (req.user) {
        firebaseAdmin.auth().revokeRefreshTokens(req.user.uid);
      }
      req.logout();
      req.session.destroy(() => {
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/login');
      });
    } else {
      next();
    }
  });

  return router;
};
