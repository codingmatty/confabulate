const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const honeybadger = require('honeybadger');
const registerApi = require('./middleware/api');
const registerCron = require('./middleware/cron');
const registerNext = require('./middleware/next');
const registerGraphQL = require('./middleware/graphql');
const registerPassport = require('./middleware/passport');
const initDatabase = require('./db');
const logger = require('./logger');

const dev = process.env.NODE_ENV !== 'production';
const Honeybadger = honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY
});
Honeybadger.setContext({
  tags: 'server'
});

module.exports = async function setupExpress() {
  const db = initDatabase(
    process.env.NODE_ENV === 'production'
      ? `mongodb://${process.env.MONGO_USERNAME}:${
          process.env.MONGO_PASSWORD
        }@${process.env.MONGO_URI}`
      : process.env.MONGO_URL
  );
  const app = express();

  const cookie = {
    sameSite: 'lax' // This is required to get the cookie in the oauth2 callback
  };
  if (!dev) {
    app.set('trust proxy', 1);
    cookie.secure = true;
    cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week

    app.use(Honeybadger.requestHandler);
    app.use(cors());
  }

  app.use(
    morgan('short', {
      stream: logger.stream,
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
      store: new MongoStore({ mongooseConnection: db.connection }),
      cookie
    })
  );

  // Setup Passport for authentication strategies
  app.use(registerPassport(db));

  // Setup API routes
  app.use('/cron', registerCron({ db, dev }));
  app.use('/api', registerApi(db));

  app.use(registerGraphQL(db));

  // Setup Next to handle client-side pages
  app.use(await registerNext({ db, dev }));

  if (!dev) {
    app.use(Honeybadger.errorHandler);
  }

  return app;
};
