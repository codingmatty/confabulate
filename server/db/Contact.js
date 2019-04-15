const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const ContactSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
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
    phoneNumber: String,
    favorite: Boolean,
    events: [Schema.Types.ObjectId],
    source: {
      type: { type: String, enum: ['google'] },
      id: String
    }
  },
  { timestamps: true }
);

class ContactModel extends DataModel {
  constructor() {
    super({ modelName: 'Contact', schema: ContactSchema });
  }
}

module.exports = ContactModel;
