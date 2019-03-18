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
    date: Date!
    title: String!
    type: String
    involvedContacts: [Contact]!
  }
  input EventInputData {
    date: Date!
    title: String!
    involvedContacts: [ID!] # contactIds
  }
  input EventUpdateData {
    date: Date
    title: String
    involvedContacts: [ID!] # contactIds
  }
  input EventQueryData {
    id: ID
    startDate: Date
    endDate: Date
    fuzzyTitle: String
    involvedContact: ContactQueryData
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    event: (obj, { id }, { db }) => db.getEvent(id),
    // TODO: Implement advanced search with EventQueryData fields
    events: (obj, { query }, { db }) => db.getEvents(query)
  },
  Mutation: {
    addEvent: (obj, { data }, { db }) => {
      const { involvedContacts = [] } = data;
      const filteredContacts = involvedContacts.filter(
        (contactId) => db.getContact(contactId) // Filter out non-existent contact ids
      );
      return db.addEvent({ ...data, involvedContacts: filteredContacts });
    },
    updateEvent: (obj, { id, data }, { db }) => db.updateEvent(id, data),
    removeEvent: (obj, { id }, { db }) => {
      const removedEvents = db.removeEvent(id);
      return {
        status: 'SUCCESS',
        message: `${removedEvents.length} Event(s) Removed`
      };
    }
  },
  Event: {
    involvedContacts: (event, args, { db }) => {
      return event.involvedContacts.map((contactId) =>
        db.getContact(contactId)
      );
    }
  }
};
