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
    title: String!
    date: Date!
    type: String
    note: String
    involvedContacts: [Contact]!
  }
  input EventInputData {
    title: String!
    date: Date!
    type: String
    note: String
    involvedContacts: [ID!] # contactIds
  }
  input EventUpdateData {
    title: String
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
  Query: {
    event: async (obj, { id }, { db, user }) => await db.getEvent(user.id, id),
    events: async (obj, { query }, { db, user }) =>
      await db.getEvents(user.id, query)
  },
  Mutation: {
    addEvent: async (obj, { data }, { db, user }) => {
      const { involvedContacts = [] } = data;
      return await db.addEvent(user.id, {
        ...data,
        involvedContacts
      });
    },
    updateEvent: async (obj, { id, data }, { db, user }) => {
      const { involvedContacts = [] } = data;
      return await db.updateEvent(user.id, id, {
        ...data,
        involvedContacts
      });
    },
    removeEvent: async (obj, { id }, { db, user }) => {
      const removedEvent = await db.removeEvent(user.id, id);
      return {
        status: removedEvent > 0 ? 'SUCCESS' : 'IGNORE',
        message: `${removedEvent} Event(s) Removed`
      };
    }
  },
  Event: {
    involvedContacts: async (event, args, { db, user }) => {
      return Promise.all(
        event.involvedContacts.map(
          async (contactId) => await db.getContact(user.id, contactId)
        )
      );
    }
  }
};
