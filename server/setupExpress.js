const express = require('express');
const registerApi = require('./registerApi');
const registerNext = require('./registerNext');

const dev = process.env.NODE_ENV !== 'production';

module.exports = async function setupExpress() {
  const app = express();
  const clientHandler = await registerNext({ dev });

  app.use('/api', registerApi());

  app.get('*', clientHandler);

  return app;
};
