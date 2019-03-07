const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', `${process.env.NODE_ENV || ''}.env`)
});
require('isomorphic-fetch');
const http = require('http');
const setupExpress = require('./setupExpress');
const port = process.env.PORT;

setupExpress().then((app) => {
  http.createServer(app).listen(port, (err) => {
    if (err) {
      throw err;
    }
    /* eslint-disable-next-line no-console */
    console.log(`Server listening on port ${port}`);
  });
});
