const path = require('path');

require('dotenv').config({
  path: path.resolve(
    __dirname,
    '..',
    [`.${process.env.NODE_ENV || ''}`, '.env'].join('')
  )
});
