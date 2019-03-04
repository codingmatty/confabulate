const { Router } = require('express');

module.exports = function registerApi() {
  const router = new Router();

  router.post('/login', passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });

  return router;
};
