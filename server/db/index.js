const { DataModel, UserModel, getStore } =
  process.env.DB_SOURCE === 'firestore'
    ? require('./firestore')
    : require('./local');

const Users = new UserModel({
  decorateData: (user) => {
    user.profile = user.profile || {};
    user.profile.firstName = user.profile.firstName || '';
    user.profile.lastName = user.profile.lastName || '';
    user.profile.fullName = [user.profile.firstName, user.profile.lastName]
      .filter((s) => s)
      .join(' ');

    return user;
  }
});

class ContactModel extends DataModel {
  constructor() {
    super('contacts', {
      decorateData: (data) => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
      })
    });
  }
}

class EventModel extends DataModel {
  constructor() {
    super('events');
  }
  async query(userId, query = {}) {
    const { involvedContact, ...propsQuery } = query;
    const events = await super.query(userId, propsQuery);
    const filteredEvents = involvedContact
      ? events.filter((event) =>
          event.involvedContacts.some((id) => id === involvedContact.id)
        )
      : events;
    return filteredEvents;
  }
}

module.exports = {
  getStore,
  Users,
  Contacts: new ContactModel(),
  Events: new EventModel()
};
