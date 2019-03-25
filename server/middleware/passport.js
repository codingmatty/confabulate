const { Router } = require('express');
const passport = require('passport');
const CustomStrategy = require('passport-custom');
const firebaseAdmin = require('../firebase-admin');

module.exports = function registerPassport(db) {
  const router = new Router();

  passport.serializeUser((idToken, done) => {
    done(null, idToken);
  });

  passport.deserializeUser(async (idToken, done) => {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      done(null, decodedToken);
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
          done(null, idToken);
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
      res.redirect('/login');
    } else {
      next();
    }
  });

  return router;
};
