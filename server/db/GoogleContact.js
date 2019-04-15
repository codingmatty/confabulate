const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const GoogleContactSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    peopleId: { type: String, unique: true },
    name: String,
    image: String,
    birthday: {
      type: {
        day: Number,
        month: Number,
        year: Number
      },
      default: {}
    },
    email: String,
    phoneNumber: String
  },
  { timestamps: true }
);
GoogleContactSchema.index(
  { createdAt: 1 },
  {
    // Expire after 30 mins giving the user that much time to complete import
    expireAfterSeconds: 60 * 30
  }
);

class GoogleContactModel extends DataModel {
  constructor() {
    super({ modelName: 'GoogleContact', schema: GoogleContactSchema });
  }
}

module.exports = GoogleContactModel;
