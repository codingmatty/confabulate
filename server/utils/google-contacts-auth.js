const { google } = require('googleapis');
const { createAuthConnection } = require('./google-auth');

const REDIRECT_URL = `${process.env.BASE_URL}/api/callback/google-contacts`;
const CONTACTS_SCOPE = ['https://www.googleapis.com/auth/contacts.readonly'];
const CONTACTS_FIELDS = [
  'emailAddresses',
  'names',
  'phoneNumbers',
  'photos',
  'birthdays'
].join(',');

function generateAuthUrl({ email }) {
  const auth = createAuthConnection();
  return auth.generateAuthUrl({
    redirect_uri: REDIRECT_URL,
    scope: CONTACTS_SCOPE,
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    login_hint: email
  });
}

function selectPrimary(data) {
  const primaryData = data.filter(({ metadata }) => metadata.primary) || [];
  return primaryData[0] || {};
}

function normalizeContactData({
  resourceName,
  names = [],
  photos = [],
  birthdays = [],
  phoneNumbers = [],
  emailAddresses = []
}) {
  return {
    peopleId: resourceName.slice('people/'.length),
    name: selectPrimary(names).displayName,
    image: selectPrimary(photos).url,
    birthday: selectPrimary(birthdays).date && {
      ...selectPrimary(birthdays).date,
      month: selectPrimary(birthdays).date.month - 1 // moment uses month starting at 0
    },
    phoneNumber: selectPrimary(phoneNumbers).canonicalForm,
    email: selectPrimary(emailAddresses).value
  };
}

async function fetchContacts({ people }) {
  let pageToken;
  const contactData = [];

  do {
    // eslint-disable-next-line no-await-in-loop
    const connectionsList = await people.connections.list({
      resourceName: 'people/me',
      personFields: CONTACTS_FIELDS,
      pageToken,
      pageSize: 1000
    });
    pageToken = connectionsList.data.nextPageToken;
    contactData.push(...connectionsList.data.connections);
  } while (pageToken);

  return contactData.map(normalizeContactData).filter(({ name }) => name);
}

async function getTokensFromCode(code) {
  const auth = createAuthConnection();
  const { tokens } = await auth.getToken({
    code,
    redirect_uri: REDIRECT_URL
  });

  return tokens;
}

async function getContactsFromCode(code) {
  const auth = createAuthConnection();
  const { tokens } = await auth.getToken({
    code,
    redirect_uri: REDIRECT_URL
  });

  auth.setCredentials(tokens);

  const peopleApi = google.people({ version: 'v1', auth });
  const contacts = await fetchContacts(peopleApi);

  return contacts;
}

module.exports = {
  generateAuthUrl,
  getContactsFromCode,
  getTokensFromCode
};
