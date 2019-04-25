const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const ContactSchema = new Schema(
  {
    birthday: {
      default: {},
      type: {
        day: Number,
        month: Number,
        year: Number
      }
    },
    email: String,
    events: [Schema.Types.ObjectId],
    favorite: Boolean,
    image: String,
    name: String,
    notes: [
      {
        label: { required: true, type: String },
        value: String
      }
    ],
    ownerId: { required: true, type: Schema.Types.ObjectId },
    phoneNumber: String,
    source: {
      id: String,
      type: { enum: ['google'], type: String }
    }
  },
  { minimize: false, timestamps: true }
);

class ContactModel extends DataModel {
  constructor() {
    super({ modelName: 'Contact', schema: ContactSchema });
  }
}

module.exports = ContactModel;
