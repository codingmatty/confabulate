const { google } = require('googleapis');

function createAuthConnection() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECRET
  );
}

module.exports = {
  createAuthConnection
};
