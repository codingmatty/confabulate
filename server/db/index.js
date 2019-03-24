module.exports =
  process.env.DB_SOURCE === 'firestore'
    ? require('./firestore')
    : require('./local');
