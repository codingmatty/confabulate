const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const UserSchema = new Schema(
  {
    uid: { type: String, unique: true },
    email: String,
    authProviders: [String],
    profile: {
      type: {
        image: String,
        name: String
      },
      default: {}
    }
  },
  { minimize: false, timestamps: true }
);

class UserModal extends DataModel {
  constructor() {
    super({ modelName: 'User', schema: UserSchema });
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

module.exports = UserModal;
