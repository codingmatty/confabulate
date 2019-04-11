const admin = require('firebase-admin');

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECTID,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_CREDENTIALS_STRING)
  )
});

module.exports = admin;
