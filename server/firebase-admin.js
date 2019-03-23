const admin = require('firebase-admin');

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECTID,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  credential: admin.credential.cert(
    require(`../${process.env.FIREBASE_CREDENTIALS_JSON}`)
  )
});

module.exports = admin;
