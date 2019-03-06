const { Router } = require('express');
const next = require('next');
const path = require('path');
const { parse } = require('url');

module.exports = async function registerNextApp({ dev }) {
  const router = new Router();
  const nextApp = next({
    dev,
    dir: path.resolve(__dirname, '..', 'client')
  });

  try {
    await nextApp.prepare();
  } catch (ex) {
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

  // example of how to redirect /a to pages/a-template.js
  router.get('/a', (req, res) => {
    const { query } = parsedUrl;
    nextApp.render(req, res, '/a-template', query);
  });

  router.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  });

  return router;
};
