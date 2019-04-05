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
      const user = await db.Users.get(userId);
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
        const user = await db.Users.get(decodedIdToken.uid);
        if (user) {
          console.log('Logged in user with email', user.email);
          done(null, user);
        } else {
          if (
            JSON.parse(process.env.SIGNUP_EMAIL_WHITELIST).includes(
              decodedIdToken.email
            )
          ) {
            console.log('Creating a new user for email', decodedIdToken.email);
            const newUser = await db.Users.create(decodedIdToken.uid, {
              email: decodedIdToken.email,
              profile: {
                image: decodedIdToken.picture
              },
              authProviders: [decodedIdToken.firebase.sign_in_provider]
            });
            done(null, newUser);
          } else {
            done(null, false, { code: 'no-account' });
          }
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
