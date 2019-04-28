const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const GoogleContactSchema = new Schema(
  {
    birthday: {
      default: {},
      type: {
        day: Number,
        month: Number,
        year: Number
      }
    },
    communicationMethods: [
      {
        label: { default: '_Other', type: String },
        primary: Boolean,
        type: {
          enum: ['email', 'phone', 'social', 'address'],
          required: true,
          type: String
        },
        value: String
      }
    ],
    image: String,
    isImported: Boolean,
    name: String,
    ownerId: { required: true, type: Schema.Types.ObjectId },
    peopleId: { type: String, unique: true }
  },
  { minimize: false, timestamps: true }
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
