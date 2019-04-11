require('./setup-env-vars');
require('isomorphic-fetch');
const http = require('http');
const setupExpress = require('./setupExpress');
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
  logger.error('Uncaught Exception', { error, message: error.message });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { promise, reason });
});
