const _ = require('lodash');
const path = require('path');
const uuidv4 = require('uuid/v4');
const low = require('lowdb');
const { unflatten } = require('flat');
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

class DataModel {
  constructor(type, { decorateData = async (data) => data } = {}) {
    this.type = type;
    this.decorateData = decorateData;
  }

  async create(userId, data) {
    const id = uuidv4();
    const collectionRef = db.get(this.type);
    collectionRef.push({ ...data, userId, id }).write();
    const createdDocument = collectionRef.find({ id }).value();
    return this.decorateData(createdDocument);
  }

  async get(userId, id) {
    const document = db
      .get(this.type)
      .find({ userId, id })
      .value();
    return document ? this.decorateData(document) : {};
  }

  async getAll(userId, query) {
    return this.query({ ...query, userId });
  }

  async query(query = {}) {
    const documents = db
      .get(this.type)
      .filter(unflatten(query))
      .value();
    return Promise.all(documents.map(this.decorateData));
  }

  async update(userId, id, data) {
    const updatedDocument = db
      .get(this.type)
      .find({ userId, id })
      .assign(data)
      .write();
    return updatedDocument ? this.decorateData(updatedDocument) : {};
  }

  async delete(userId, id) {
    const removedDocument = db
      .get(this.type)
      .remove({ userId, id })
      .first()
      .write();
    return removedDocument ? this.decorateData(removedDocument) : null;
  }
}

class UserModel {
  constructor({ decorateData = async (data) => data } = {}) {
    this.decorateData = decorateData;
  }

  async create(id, data) {
    db.get('users')
      .set(id, { ...data, id })
      .write();
    return this.get(id);
  }

  async get(id) {
    const user = db
      .get('users')
      .get(id)
      .value();
    return user ? this.decorateData(user) : null;
  }

  async update(id, data) {
    const user = db
      .get('users')
      .get(id)
      .assign(data)
      .write();
    return this.decorateData(user);
  }
}

function getStore(session) {
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

exports.resetDb = resetDb;
exports.UserModel = UserModel;
exports.DataModel = DataModel;
exports.getStore = getStore;
