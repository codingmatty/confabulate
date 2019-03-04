const next = require('next');
const path = require('path');
// const pathToRegexp = require('path-to-regexp');
const { parse } = require('url');

module.exports = async function registerNextApp({ dev }) {
  const nextApp = next({
    dev,
    dir: path.resolve(__dirname, '..', 'client')
  });
  const requestHandler = nextApp.getRequestHandler();

  try {
    await nextApp.prepare();
  } catch (ex) {
    console.error('NEXT ERROR', ex.stack);
    process.exit(1);
  }

  // Return Express Router callback
  return (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/a') {
      nextApp.render(req, res, '/b', query);
    } else if (pathname === '/b') {
      nextApp.render(req, res, '/a', query);
    } else {
      requestHandler(req, res, parsedUrl);
    }
  };
};
