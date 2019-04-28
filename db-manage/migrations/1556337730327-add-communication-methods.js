const db = require('../db');

module.exports.up = async () => {
  const contacts = await db.Contacts.model.find({}, { strict: false });
  return Promise.all(
    contacts
      .map((contact) => contact.toObject({ getters: true }))
      .map((contact) => {
        const communicationMethods = contact.communicationMethods || [];
        if (contact.email) {
          communicationMethods.push({
            label: 'Email',
            primary: true,
            type: 'email',
            value: contact.email
          });
        }
        if (contact.phoneNumber) {
          communicationMethods.push({
            label: 'Phone Number',
            primary: true,
            type: 'phone',
            value: contact.phoneNumber
          });
        }
        return db.Contacts.model.findByIdAndUpdate(
          contact.id,
          {
            $set: { communicationMethods }
            // $unset: { email: '', phoneNumber: '' }
          },
          { strict: false }
        );
      })
  );
};

module.exports.down = async () => {};
