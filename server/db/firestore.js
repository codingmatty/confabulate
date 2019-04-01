const flatten = require('flat');
const firebaseAdmin = require('../firebase-admin');

const firestore = firebaseAdmin.firestore();

async function decorateSnapshot(snapshot) {
  const data = await snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    createdAt: snapshot.createTime.toDate(),
    updatedAt: snapshot.createTime.toDate()
  };
}

async function decorateUser(snapshot) {
  const user = await decorateSnapshot(snapshot);
  user.profile = user.profile || {};
  user.profile.firstName = user.profile.firstName || '';
  user.profile.lastName = user.profile.lastName || '';
  user.profile.fullName = [user.profile.firstName, user.profile.lastName]
    .filter((s) => s)
    .join(' ');

  return user;
}
async function decorateContact(snapshot) {
  const contact = await decorateSnapshot(snapshot);
  return {
    ...contact,
    fullName: `${contact.firstName} ${contact.lastName}`
  };
}

async function addUser(userId, data) {
  const document = firestore.collection('users').doc(userId);
  await document.set(data);
  const snapshot = await document.get();
  return await decorateUser(snapshot);
}

async function getUser(userId) {
  const document = firestore.collection('users').doc(userId);
  const snapshot = await document.get();
  if (!snapshot.exists) {
    return null;
  }
  return await decorateUser(snapshot);
}

async function updateUser(userId, data) {
  const document = firestore.collection('users').doc(userId);
  let snapshot = await document.get();
  if (!snapshot.exists) {
    return {};
  }
  await document.update(data);
  snapshot = await document.get();
  return await decorateSnapshot(snapshot);
}

async function addContact(userId, data) {
  const contacts = firestore.collection('contacts');
  const document = await contacts.add({ ...data, userId });
  const snapshot = await document.get();
  return await decorateContact(snapshot);
}

async function getContacts(userId, query = {}) {
  const contacts = firestore.collection('contacts');
  let collectionQuery = contacts.where('userId', '==', userId);
  for (let key in query) {
    collectionQuery = collectionQuery.where(key, '==', query[key]);
  }
  const { docs } = await collectionQuery.get();
  return Promise.all(docs.map(decorateContact));
}

async function getContact(userId, id) {
  const document = firestore.collection('contacts').doc(id);
  const snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  return await decorateContact(snapshot);
}

async function updateContact(userId, id, data) {
  const document = firestore.collection('contacts').doc(id);
  let snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  await document.update(data);
  snapshot = await document.get();
  return await decorateContact(snapshot);
}

async function removeContact(userId, id) {
  const document = firestore.collection('contacts').doc(id);
  let snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  // fetch data before deleting
  const data = await decorateContact(snapshot);
  await document.delete();
  return data;
}

async function addEvent(userId, data) {
  const events = firestore.collection('events');
  const document = await events.add({ ...data, userId });
  const snapshot = await document.get();
  return await decorateSnapshot(snapshot);
}

async function getEvents(userId, query = {}) {
  const events = firestore.collection('events');
  let collectionQuery = events.where('userId', '==', userId);
  const { involvedContact, ...propQuery } = query;
  for (let key in propQuery) {
    collectionQuery = collectionQuery.where(key, '==', query[key]);
  }
  const { docs } = await collectionQuery.get();
  return Promise.all(docs.map(decorateSnapshot)).then((filteredEvents) =>
    filteredEvents.filter((event) =>
      event.involvedContacts.some((id) => id === involvedContact.id)
    )
  );
}

async function getEvent(userId, id) {
  const document = firestore.collection('events').doc(id);
  const snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  return await decorateSnapshot(snapshot);
}

async function updateEvent(userId, id, data) {
  const document = firestore.collection('events').doc(id);
  let snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  await document.update(data);
  snapshot = await document.get();
  return await decorateSnapshot(snapshot);
}

async function removeEvent(userId, id) {
  const document = firestore.collection('events').doc(id);
  let snapshot = await document.get();
  if (!snapshot.exists || snapshot.get('userId') !== userId) {
    return {};
  }
  // fetch data before deleting
  const data = await decorateSnapshot(snapshot);
  await document.delete();
  return data;
}

function store(session) {
  class FirestoreDBStore extends session.Store {
    async all(done) {
      try {
        const documents = await firestore
          .collection('sessions')
          .listDocuments();
        const snapshots = await firestore.getAll(documents);
        const sessions = await Promise.all(
          snapshots
            .filter(({ exists }) => exists)
            .map(async (snapshot) => snapshot.data())
        );
        done(null, sessions.map((session) => flatten.unflatten(session)));
      } catch (error) {
        done(error);
      }
    }
    async destroy(sid, done) {
      try {
        const document = await firestore.collection('sessions').doc(sid);
        await document.delete();
        done(null);
      } catch (error) {
        done(error);
      }
    }
    clear(done) {
      // Don't do anything
      done(null);
    }
    async length(done) {
      try {
        const documents = await firestore
          .collection('sessions')
          .listDocuments();
        done(null, documents.length);
      } catch (error) {
        done(error);
      }
    }
    async get(sid, done) {
      try {
        const document = await firestore.collection('sessions').doc(sid);
        const snapshot = await document.get();
        const session = await snapshot.data();
        done(null, flatten.unflatten(session));
      } catch (error) {
        done(error);
      }
    }
    async set(sid, session, done) {
      try {
        const document = await firestore.collection('sessions').doc(sid);
        await document.set(flatten(session));
        done(null);
      } catch (error) {
        done(error);
      }
    }
    async touch(sid, session, done) {
      try {
        const document = await firestore.collection('sessions').doc(sid);
        await document.set(flatten(session));
        done(null);
      } catch (error) {
        done(error);
      }
    }
  }

  return FirestoreDBStore;
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  addContact,
  updateContact,
  removeContact,
  getContact,
  getContacts,
  addEvent,
  updateEvent,
  removeEvent,
  getEvent,
  getEvents,
  store
};
