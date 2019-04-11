const db = require('../../server/db');

module.exports.up = async () => {
  return db.Events.model.updateMany(
    {},
    { $unset: { title: '' } },
    { strict: false /* To remove undefined field title */ }
  );
};

module.exports.down = async () => {
  return db.Events.model.updateMany({}, { $set: { title: '' } });
};
