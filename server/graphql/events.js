const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
    events(query: EventQueryData = {}): [Event]!
  }
  extend type Mutation {
    addEvent(data: EventInputData): Event
    updateEvent(id: ID!, data: EventUpdateData): Event
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
    event: (obj, { id }, { db, user }) => db.getEvent(user.id, id),
    // TODO: Implement advanced search with EventQueryData fields
    events: (obj, { query }, { db, user }) => db.getEvents(user.id, query)
  },
  Mutation: {
    addEvent: (obj, { data }, { db, user }) => {
      const { involvedContacts = [] } = data;
      const filteredContacts = involvedContacts.filter(
        (contactId) => db.getContact(user.id, contactId) // Filter out non-existent contact ids
      );
      return db.addEvent(user.id, {
        ...data,
        involvedContacts: filteredContacts
      });
    },
    updateEvent: (obj, { id, data }, { db, user }) => {
      const { involvedContacts = [] } = data;
      const filteredContacts = involvedContacts.filter(
        (contactId) => db.getContact(user.id, contactId) // Filter out non-existent contact ids
      );
      return db.updateEvent(user.id, id, {
        ...data,
        involvedContacts: filteredContacts
      });
    },
    removeEvent: (obj, { id }, { db, user }) => {
      const removedEvents = db.removeEvent(user.id, id);
      return {
        status: removedEvents.length > 0 ? 'SUCCESS' : 'IGNORE',
        message: `${removedEvents.length} Event(s) Removed`
      };
    }
  },
  Event: {
    involvedContacts: (event, args, { db, user }) => {
      return event.involvedContacts.map((contactId) =>
        db.getContact(user.id, contactId)
      );
    }
  }
};
