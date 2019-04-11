const admin = require('firebase-admin');

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECTID,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECTID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

module.exports = admin;
