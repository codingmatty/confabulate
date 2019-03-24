const { Router } = require('express');
const passport = require('passport');
const CustomStrategy = require('passport-custom');
const firebaseAdmin = require('../firebase-admin');

module.exports = function registerPassport() {
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
        await firebaseAdmin.auth().verifyIdToken(idToken);
        done(null, idToken);
      } catch (error) {
        done(error);
      }
    })
  );

  router.use(passport.initialize());
  router.use(passport.session());

  router.use(function(err, req, res, next) {
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
