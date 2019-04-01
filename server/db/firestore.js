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

class DataModel {
  constructor(type, { decorateData = async (data) => data } = {}) {
    this.type = type;
    this.decorateData = async (snapshot) => {
      const decoratedSnapshot = await decorateSnapshot(snapshot);
      return decorateData(decoratedSnapshot);
    };
  }

  async create(userId, data) {
    const collectionRef = firestore.collection(this.type);
    const document = await collectionRef.add({ ...data, userId });
    const snapshot = await document.get();
    return this.decorateData(snapshot);
  }

  async get(userId, id) {
    const document = firestore.collection(this.type).doc(id);
    const snapshot = await document.get();
    if (!snapshot.exists || snapshot.get('userId') !== userId) {
      return {};
    }
    return this.decorateData(snapshot);
  }

  async query(userId, query) {
    const collectionRef = firestore.collection(this.type);
    let collectionQuery = collectionRef.where('userId', '==', userId);
    for (let key in query) {
      collectionQuery = collectionQuery.where(key, '==', query[key]);
    }
    const { docs } = await collectionQuery.get();
    return Promise.all(docs.map(this.decorateData));
  }

  async update(userId, id, data) {
    const document = firestore.collection(this.type).doc(id);
    let snapshot = await document.get();
    if (!snapshot.exists || snapshot.get('userId') !== userId) {
      return {};
    }
    await document.update(data);
    snapshot = await document.get();
    return this.decorateData(snapshot);
  }

  async delete(userId, id) {
    const document = firestore.collection(this.type).doc(id);
    let snapshot = await document.get();
    if (!snapshot.exists || snapshot.get('userId') !== userId) {
      return null;
    }
    // fetch data before deleting
    const data = this.decorateData(snapshot);
    await document.delete();
    return data;
  }
}

class UserModel {
  constructor({ decorateData = async (data) => data } = {}) {
    this.decorateData = async (snapshot) => {
      const decoratedSnapshot = await decorateSnapshot(snapshot);
      return decorateData(decoratedSnapshot);
    };
  }

  async create(id, data) {
    const document = firestore.collection('users').doc(id);
    await document.set(data);
    const snapshot = await document.get();
    return this.decorateData(snapshot);
  }

  async get(id) {
    const document = firestore.collection('users').doc(id);
    const snapshot = await document.get();
    if (!snapshot.exists) {
      return null;
    }
    return this.decorateData(snapshot);
  }

  async update(id, data) {
    const document = firestore.collection('users').doc(id);
    let snapshot = await document.get();
    if (!snapshot.exists) {
      return null;
    }
    await document.update(data);
    snapshot = await document.get();
    return this.decorateData(snapshot);
  }
}

function getStore(session) {
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

exports.UserModel = UserModel;
exports.DataModel = DataModel;
exports.getStore = getStore;
