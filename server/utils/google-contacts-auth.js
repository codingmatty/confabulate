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

function generateAuthUrl({ email, inline }) {
  const auth = createAuthConnection();
  return auth.generateAuthUrl({
    access_type: 'offline',
    login_hint: email,
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    redirect_uri: REDIRECT_URL,
    scope: CONTACTS_SCOPE,
    state: Buffer.from(JSON.stringify({ inline })).toString('base64')
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
    birthday: selectPrimary(birthdays).date && {
      ...selectPrimary(birthdays).date,
      month: selectPrimary(birthdays).date.month - 1 // moment uses month starting at 0
    },
    communicationMethods: [
      ...phoneNumbers.map(({ canonicalForm, metadata, type }) => ({
        label: type,
        primary: metadata.primary,
        type: 'phone',
        value: canonicalForm
      })),
      ...emailAddresses.map(({ metadata, type, value }) => ({
        label: type,
        primary: metadata.primary,
        type: 'email',
        value
      }))
    ],
    image: selectPrimary(photos).url,
    name: selectPrimary(names).displayName,
    peopleId: resourceName.slice('people/'.length)
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
