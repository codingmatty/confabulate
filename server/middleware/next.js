const { Router } = require('express');
const next = require('next');
const path = require('path');
const { parse } = require('url');

module.exports = async function registerNextApp({ dev }) {
  const router = new Router();
  const nextApp = next({
    dev,
    dir: path.resolve(__dirname, '..', '..', 'client'),
    conf: {
      env: {
        FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
        FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
        FIREBASE_CLIENT_APIKEY: process.env.FIREBASE_CLIENT_APIKEY
      }
    }
  });

  try {
    await nextApp.prepare();
  } catch (ex) {
    /* eslint-disable-next-line no-console */
    console.error('NEXT ERROR', ex.stack);
    process.exit(1);
  }

  const requestHandler = nextApp.getRequestHandler();

  router.get('/login', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.redirect('/');
      return;
    }
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  router.get('/signup', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.redirect('/');
      return;
    }
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  router.get('/_next/*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  router.get('/favicon.ico', (req, res) => {
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
