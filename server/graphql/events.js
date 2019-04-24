const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
    events(query: EventQueryData = {}): [Event]!
  }
  extend type Mutation {
    addEvent(data: EventInputData!): Event
    updateEvent(id: ID!, data: EventUpdateData!): Event
    removeEvent(id: ID!): Status
  }
  type Event {
    id: ID!
    date: Date!
    type: String
    note: String
    involvedContacts: [Contact!]!
  }
  input EventInputData {
    date: Date!
    type: String
    note: String
    involvedContacts: [ID!] # contactIds
  }
  input EventUpdateData {
    date: Date
    type: String
    note: String
    involvedContacts: [ID!] # contactIds
  }
  input EventQueryData {
    id: ID
    fuzzyTitle: String
    startDate: Date
    endDate: Date
    type: String
    involvedContact: ContactQueryData
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Event: {
    involvedContacts: async (event, args, { db, user }) => {
      return db.Contacts.getAll(user.id, {
        _id: { $in: event.involvedContacts }
      });
    }
  },
  Mutation: {
    addEvent: async (obj, { data }, { db, user }) => {
      const { involvedContacts = [] } = data;
      // Verify data in involvedContacts exists by querying Contacts db
      const contacts = await db.Contacts.getAll(user.id, {
        _id: { $in: involvedContacts }
      });
      return db.Events.create(user.id, {
        ...data,
        involvedContacts: contacts.map(({ id }) => id)
      });
    },
    removeEvent: async (obj, { id }, { db, user }) => {
      const removedEvent = await db.Events.delete(user.id, id);
      return {
        message: removedEvent ? 'Event Removed' : '',
        status: removedEvent ? 'SUCCESS' : 'IGNORED'
      };
    },
    updateEvent: async (obj, { id, data }, { db, user }) => {
      const { involvedContacts } = data;
      if (involvedContacts) {
        // Verify data in involvedContacts exists by querying Contacts db
        const contacts = await db.Contacts.getAll(user.id, {
          _id: { $in: involvedContacts }
        });
        data.involvedContacts = contacts.map(({ id }) => id);
      }
      return db.Events.update(user.id, id, data);
    }
  },
  Query: {
    event: async (obj, { id }, { db, user }) => db.Events.get(user.id, id),
    events: async (obj, { query }, { db, user }) => {
      const { involvedContact, ...normalizedQuery } = query;
      if (involvedContact) {
        normalizedQuery.involvedContacts = involvedContact.id;
      }
      return db.Events.getAll(user.id, normalizedQuery);
    }
  }
};
