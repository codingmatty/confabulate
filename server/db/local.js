const path = require('path');
const uuidv4 = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.resolve(__dirname, '..', '..', 'db.json'));
const db = low(adapter);

db.defaults({
  users: [{ id: 1, username: 'test', password: 'test' }],
  sessions: {},
  contacts: [],
  events: []
}).write();

exports.getUser = (id) => {
  return db
    .get('users')
    .find({ id })
    .value();
};

exports.findUser = (query) => {
  return db
    .get('users')
    .find(query)
    .value();
};

exports.addContact = (contact) => {
  const contactsRef = db.get('contacts');
  const id = uuidv4();
  contactsRef.push({ ...contact, id }).write();
  return contactsRef.find({ id }).value();
};

exports.updateContact = (id, contact) => {
  return db
    .get('contacts')
    .find({ id })
    .assign(contact)
    .write();
};

exports.removeContact = (id) => {
  return db
    .get('contacts')
    .remove({ id })
    .write();
};

exports.getContact = (id) => {
  const contact = db
    .get('contacts')
    .find({ id })
    .value();
  return contact;
};

exports.getContacts = (query) => {
  return db
    .get('contacts')
    .filter(query)
    .value();
};

exports.addEvent = (event) => {
  const eventsRef = db.get('events');
  const id = uuidv4();
  eventsRef.push({ ...event, id }).write();
  return eventsRef.find({ id }).value();
};

exports.updateEvent = (id, event) => {
  return db
    .get('events')
    .find({ id })
    .assign(event)
    .write();
};

exports.removeEvent = (id) => {
  return db
    .get('events')
    .remove({ id })
    .write();
};

exports.getEvent = (id) => {
  return db
    .get('events')
    .find({ id })
    .value();
};

exports.getEvents = (query) => {
  return db
    .get('events')
    .filter(query)
    .value();
};

exports.store = function(session) {
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
};
