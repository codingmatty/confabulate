const mongoose = require('mongoose');
const logger = require('../logger');
const UserModel = require('./User');
const ContactModel = require('./Contact');
const GoogleContactModel = require('./GoogleContact');
const EventModel = require('./Event');

mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? `mongodb://${process.env.MONGODB_USERNAME}:${
        process.env.MONGODB_PASSWORD
      }@${process.env.MONGODB_URI}`
    : `mongodb://${process.env.MONGODB_URI}`,
  {
    useNewUrlParser: true
  }
);

mongoose.connection.on('error', (error) => {
  logger.error('DB Connection Error', { error, message: error.message });
});
mongoose.connection.once('open', () => {
  logger.info('DB Connected');
});

module.exports = {
  connection: mongoose.connection,
  Users: new UserModel(),
  Contacts: new ContactModel(),
  GoogleContacts: new GoogleContactModel(),
  Events: new EventModel()
};
