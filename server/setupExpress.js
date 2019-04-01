const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const registerApi = require('./middleware/api');
const registerNext = require('./middleware/next');
const registerGraphQL = require('./middleware/graphql');
const registerPassport = require('./middleware/passport');
const db = require('./db');

const dev = process.env.NODE_ENV !== 'production';

module.exports = async function setupExpress() {
  const dbStore = db.getStore(session);
  const app = express();

  const cookie = { sameSite: true };
  if (!dev) {
    app.set('trust proxy', 1);
    cookie.secure = true;
    cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
  }

  app.use(
    morgan('short', {
      skip: function(req) {
        if (req.path.startsWith('/_next') || req.path.startsWith('/static')) {
          // Skip _next or static specific requests
          return true;
        }
        return false;
      }
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new dbStore(),
      cookie
    })
  );

  // Setup Passport for authentication strategies
  app.use(registerPassport(db));

  // Setup API routes
  app.use('/api', registerApi());

  app.use(registerGraphQL(db));

  // Setup Next to handle client-side pages
  app.use(await registerNext({ dev }));

  return app;
};
