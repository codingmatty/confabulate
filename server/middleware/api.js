const { Router } = require('express');
const passport = require('passport');
const firebaseAdmin = require('../firebase-admin');

module.exports = function registerApi() {
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
