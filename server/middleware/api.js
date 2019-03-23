const { Router } = require('express');
const passport = require('passport');
const firebaseAdmin = require('../firebase-admin');

module.exports = function registerApi() {
  const router = new Router();

  router.post(
    '/login',
    passport.authenticate('custom', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
  router.get('/logout', (req, res) => {
    firebaseAdmin.auth().revokeRefreshTokens(req.user.uid);
    req.logout();
    res.redirect('/login');
  });

  return router;
};
