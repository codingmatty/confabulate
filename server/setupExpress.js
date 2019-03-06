const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const registerApi = require('./registerApi');
const registerNext = require('./registerNext');
const registerPassport = require('./registerPassport');
const db = require('./db');

const dev = process.env.NODE_ENV !== 'production';

module.exports = async function setupExpress() {
  const app = express();
  const LowDBStore = db.store(session);

  app.use(morgan('combined'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new LowDBStore()
    })
  );

  // Setup Passport for authentication strategies
  app.use(registerPassport(db));

  // Setup API routes
  app.use('/api', registerApi());

  // Setup Next to handle client-side pages
  app.use(await registerNext({ dev }));

  return app;
};
