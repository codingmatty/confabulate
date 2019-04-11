const db = require('../../server/db');

module.exports.up = async () => {
  const contacts = await db.Contacts.model.find({}, { strict: false });
  return Promise.all(
    contacts.map((contact) => {
      const { firstName, lastName } = contact.toObject();
      const name = [firstName, lastName].filter((x) => x).join(' ');
      return contact.update(
        {
          $set: { name },
          $unset: { firstName: '', lastName: '' }
        },
        { strict: false }
      );
    })
  );
};

module.exports.down = async () => {
  const contacts = await db.Contacts.model.find({}, { strict: false });
  return Promise.all(
    contacts.map((contact) => {
      const { name = '' } = contact.toObject();
      const nameParts = name.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return contact.update(
        {
          $set: {
            firstName,
            lastName
          },
          $unset: { name: '' }
        },
        { strict: false }
      );
    })
  );
};
