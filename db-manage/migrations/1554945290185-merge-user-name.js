const db = require('../../server/db');

module.exports.up = async () => {
  const users = await db.Users.query();
  return Promise.all(
    users.map((user) => {
      const { profile = {} } = user;
      const name = [profile.firstName, profile.lastName]
        .filter((x) => x)
        .join(' ');
      return user.update(
        {
          $set: { 'profile.name': name },
          $unset: { 'profile.firstName': '', 'profile.lastName': '' }
        },
        { strict: false }
      );
    })
  );
};

module.exports.down = async () => {
  const users = await db.Users.query();
  return Promise.all(
    users.map((user) => {
      const { profile = {} } = user;
      const { name = '' } = profile;
      const nameParts = name.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return user.update(
        {
          $set: {
            'profile.firstName': firstName,
            'profile.lastName': lastName
          },
          $unset: { 'profile.name': '' }
        },
        { strict: false }
      );
    })
  );
};
