const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function registerPassport(db) {
  const router = new Router();

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user;
    try {
      user = await db.getUser(id);
    } catch (err) {
      done(err);
    }
    done(null, user);
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      let user;
      try {
        user = await db.findUser({ username });
      } catch (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    })
  );

  router.use(passport.initialize());
  router.use((req, res, next) => {
    passport.session()(req, res, next);
  });

  return router;
};
