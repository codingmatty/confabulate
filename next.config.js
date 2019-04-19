require('./server/setup-env-vars');

module.exports = {
  env: {
    HONEYBADGER_API_KEY: process.env.HONEYBADGER_API_KEY,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
    FIREBASE_CLIENT_APIKEY: process.env.FIREBASE_CLIENT_APIKEY
  }
};
