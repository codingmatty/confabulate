const { Router } = require('express');
const passport = require('passport');

module.exports = function registerApi() {
  const router = new Router();

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
