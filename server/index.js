require('./setup-env-vars');
require('isomorphic-fetch');
const http = require('http');
const setupExpress = require('./setup-express');
const logger = require('./logger');

const port = process.env.PORT || 8910;

setupExpress().then((app) => {
  http.createServer(app).listen(port, (err) => {
    if (err) {
      throw err;
    }
    /* eslint-disable-next-line no-console */
    logger.info(`Server listening on port ${port}`);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error,
    message: error.message,
    stack: error.stack
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason: reason.stack || reason });
});
