module.exports =
  process.env.NODE_ENV === 'development' ? require('./local') : {};
