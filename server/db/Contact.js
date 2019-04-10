const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const ContactSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

class ContactModel extends DataModel {
  constructor() {
    super({ modelName: 'Contact', schema: ContactSchema });
  }
}

module.exports = ContactModel;
