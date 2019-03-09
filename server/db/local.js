const path = require('path');
const uuidv4 = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.resolve(__dirname, '..', '..', 'db.json'));
const db = low(adapter);

db.defaults({
  users: [{ id: 1, username: 'test', password: 'test' }],
  sessions: {},
  contacts: []
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
  const contactsPtr = db.get('contacts');
  const id = uuidv4();
  contactsPtr.push({ friends: [], ...contact, id }).write();
  return contactsPtr.find({ id }).value();
};

exports.removeContact = (id) => {
  return db
    .get('contacts')
    .remove({ id })
    .write();
};

exports.getContact = (id) => {
  return db
    .get('contacts')
    .find({ id })
    .value();
};

exports.getContacts = (query) => {
  return db
    .get('contacts')
    .filter(query)
    .value();
};

exports.addFriend = (id, friendId) => {
  const contactsPtr = db.get('contacts');
  const contact = contactsPtr.find({ id }).value();
  const friend = contactsPtr.find({ id: friendId }).value();
  contact.friends.push(friend.id);
  contactsPtr.write();
  return contactsPtr.find({ id }).value();
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
