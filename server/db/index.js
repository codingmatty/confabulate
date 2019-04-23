const mongoose = require('mongoose');
const logger = require('../logger');
const UserModel = require('./User');
const ContactModel = require('./Contact');
const GoogleContactModel = require('./GoogleContact');
const EventModel = require('./Event');

module.exports = function initDatabase(mongoUrl) {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true
  });

  mongoose.connection.on('error', (error) => {
    logger.error('DB Connection Error', { error, message: error.message });
  });
  mongoose.connection.once('open', () => {
    logger.info('DB Connected');
  });

  return {
    Contacts: new ContactModel(),
    Events: new EventModel(),
    GoogleContacts: new GoogleContactModel(),
    Users: new UserModel(),
    connection: mongoose.connection
  };
};
