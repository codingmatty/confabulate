const path = require('path');
const { parse } = require('url');
const { Router } = require('express');
const next = require('next');
const gqlSchema = require('../graphql');

module.exports = async function registerNextApp({ db, dev }) {
  const router = new Router();
  const nextApp = next({
    dev,
    dir: path.resolve(__dirname, '..', '..', 'client')
  });

  try {
    await nextApp.prepare();
  } catch (ex) {
    /* eslint-disable-next-line no-console */
    console.error('NEXT ERROR', ex.stack);
    process.exit(1);
  }

  const requestHandler = nextApp.getRequestHandler();

  router.get(['/login', '/signup'], (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.redirect('/');
      return;
    }
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  router.get(['/_next/*', '/static/*'], (req, res) => {
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  // Require authentication for all following client-side pages
  router.use((req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      next();
      return;
    }
    res.status(401).redirect('/login');
  });

  router.use((req, res, next) => {
    // Add this info to use for SSR for Apollo Client
    req.apolloClientContext = {
      db,
      schema: gqlSchema,
      user: req.user
    };
    next();
  });

  // Example of how to redirect /a to pages/a-template.js
  router.get('/contacts/:id', (req, res, next) => {
    if (req.params.id === 'create') {
      // Let next default handler deal with /contacts/create
      next();
      return;
    }
    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;
    nextApp.render(req, res, '/contacts/info', { id: req.params.id, ...query });
  });

  router.get('/', (req, res) => {
    // Since there is no real homepage, lets redirect user to contacts list
    res.redirect('/contacts');
  });

  router.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  return router;
};
