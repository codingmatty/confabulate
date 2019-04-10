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
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' }
      },
      default: {}
    }
  },
  { timestamps: true }
);
UserSchema.virtual('profile.fullName').get(function() {
  return [this.profile.firstName, this.profile.lastName]
    .filter((s) => s)
    .join(' ');
});

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
