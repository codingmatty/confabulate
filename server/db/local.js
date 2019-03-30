const _ = require('lodash');
const path = require('path');
const uuidv4 = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');

const adapter =
  process.env.NODE_ENV === 'test'
    ? new Memory()
    : new FileSync(path.resolve(__dirname, '..', '..', 'db.json'));
const db = low(adapter);

const defaults = {
  users: {},
  sessions: {},
  contacts: [],
  events: []
};

db.defaults(defaults).write();

function resetDb(data) {
  db.setState({ ...defaults, ..._.cloneDeep(data) });
}

function addUser(id, data) {
  db.get('users')
    .set(id, { ...data, id })
    .write();
  return getUser(id);
}

function getUser(id) {
  return db
    .get('users')
    .get(id)
    .value();
}

function findUser(query) {
  return db
    .get('users')
    .find(query)
    .value();
}

function addContact(userId, contact) {
  const contactsRef = db.get('contacts');
  const id = uuidv4();
  contactsRef.push({ ...contact, userId, id }).write();
  return contactsRef.find({ id }).value();
}

function updateContact(userId, id, contact) {
  return db
    .get('contacts')
    .find({ userId, id })
    .assign(contact)
    .write();
}

function removeContact(userId, id) {
  return db
    .get('contacts')
    .remove({ userId, id })
    .write();
}

function getContact(userId, id) {
  const contact = db
    .get('contacts')
    .find({ userId, id })
    .value();
  return contact;
}

function getContacts(userId, query) {
  return db
    .get('contacts')
    .filter({ ...query, userId })
    .value();
}

function addEvent(userId, event) {
  const eventsRef = db.get('events');
  const id = uuidv4();
  eventsRef.push({ ...event, userId, id }).write();
  return eventsRef.find({ id }).value();
}

function updateEvent(userId, id, event) {
  return db
    .get('events')
    .find({ userId, id })
    .assign(event)
    .write();
}

function removeEvent(userId, id) {
  return db
    .get('events')
    .remove({ userId, id })
    .write();
}

function getEvent(userId, id) {
  return db
    .get('events')
    .find({ userId, id })
    .value();
}

function getEvents(userId, query) {
  return db
    .get('events')
    .filter({ ...query, userId })
    .value();
}

function store(session) {
  class LowDBStore extends session.Store {
    all(done) {
      const sessions = db
        .get('sessions')
        .values()
        .value();
      done(null, sessions);
    }
    destroy(sid, done) {
      db.get('sessions')
        .omit({ sid })
        .write();
      done(null);
    }
    clear(done) {
      db.get('sessions')
        .set({})
        .write();
      done(null);
    }
    length(done) {
      const length = db
        .get('sessions')
        .keys()
        .toLength()
        .value();
      done(null, length);
    }
    get(sid, done) {
      const session = db
        .get('sessions')
        .get(sid)
        .value();
      done(null, session);
    }
    set(sid, session, done) {
      db.get('sessions')
        .set(sid, session)
        .write();
      done(null);
    }
    touch(sid, session, done) {
      db.get('sessions')
        .set(sid, session)
        .write();
      done(null);
    }
  }

  return LowDBStore;
}

module.exports = {
  resetDb,
  addUser,
  getUser,
  findUser,
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
