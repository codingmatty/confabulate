const mongoose = require('mongoose');
const logger = require('../logger');

const { Schema } = mongoose;

mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${
        process.env.MONGODB_PASSWORD
      }@${process.env.MONGODB_URI}`
    : `mongodb://${process.env.MONGODB_URI}`,
  {
    useNewUrlParser: true
  }
);

mongoose.connection.on('error', (error) => {
  logger.error('DB Connection Error', { error });
});
mongoose.connection.once('open', () => {
  logger.info('DB Connected');
});

//

const UserSchema = new Schema({
  uid: { type: String, unique: true },
  email: String,
  authProviders: [String],
  profile: {
    type: {
      image: String,
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' }
    },
    default: {}
  }
});
UserSchema.virtual('profile.fullName').get(function() {
  return [this.profile.firstName, this.profile.lastName]
    .filter((s) => s)
    .join(' ');
});

const ContactSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true },
  firstName: String,
  lastName: String,
  birthday: {
    type: {
      day: Number,
      month: Number,
      year: Number
    },
    default: {}
  },
  email: String,
  phoneNumber: String,
  favorite: Boolean,
  events: [Schema.Types.ObjectId]
});
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const EventSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true },
  title: String,
  date: Date,
  type: String,
  note: String,
  involvedContacts: [Schema.Types.ObjectId]
});

function getModelName(type) {
  switch (type) {
    case 'contacts':
      return 'Contact';
    case 'events':
      return 'Event';
  }
}

function getSchema(type) {
  switch (type) {
    case 'contacts':
      return ContactSchema;
    case 'events':
      return EventSchema;
  }
}

class DataModel {
  constructor(type) {
    this.model = mongoose.model(getModelName(type), getSchema(type));
  }

  async create(ownerId, data) {
    const createdDocument = await this.model.create({ ...data, ownerId });
    return createdDocument;
  }

  async get(ownerId, id) {
    const document = await this.model.findOne({ _id: id, ownerId });
    return document ? document : {};
  }

  async getAll(ownerId, query) {
    return this.query({ ...query, ownerId });
  }

  async query(query = {}) {
    const documents = await this.model.find(query);
    return documents;
  }

  async update(ownerId, id, data) {
    const updatedDocument = await this.model.findOneAndUpdate(
      { _id: id, ownerId },
      data,
      { new: true }
    );
    return updatedDocument ? updatedDocument : {};
  }

  async delete(ownerId, id) {
    const removedDocument = await this.model.findOneAndRemove({
      _id: id,
      ownerId
    });
    return removedDocument ? removedDocument : null;
  }
}

class UserModel {
  constructor() {
    this.model = mongoose.model('User', UserSchema);
  }

  async create(uid, data) {
    return this.model.create({ ...data, uid });
  }

  async get(id) {
    return this.model.findOne({ _id: id });
  }

  async getByUID(uid) {
    return this.model.findOne({ uid });
  }

  async update(id, data) {
    return this.model.findOneAndUpdate({ _id: id }, data, {
      new: true
    });
  }
}

class ContactModel extends DataModel {
  constructor() {
    super('contacts');
  }
}

class EventModel extends DataModel {
  constructor() {
    super('events');
  }
}

module.exports = {
  connection: mongoose.connection,
  Users: new UserModel(),
  Contacts: new ContactModel(),
  Events: new EventModel()
};
