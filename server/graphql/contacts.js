const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contact(id: ID!): Contact
    contacts(query: ContactQueryData = {}): [Contact]!
  }
  extend type Mutation {
    addContact(data: ContactInputData): Contact
    updateContact(id: ID!, data: ContactInputData): Contact
    removeContact(id: ID!): Status
  }
  type Contact {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    favorite: Boolean
    events: [Event]!
  }
  input ContactInputData {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    favorite: Boolean
  }
  input ContactQueryData {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    favorite: Boolean
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    contact: (obj, { id }, { db }) => db.getContact(id),
    contacts: (obj, { query }, { db }) => db.getContacts(query)
  },
  Mutation: {
    addContact: (obj, { data }, { db }) => db.addContact(data),
    updateContact: (obj, { id, data }, { db }) => db.updateContact(id, data),
    removeContact: (obj, { id }, { db }) => {
      const removedContacts = db.removeContact(id);
      return {
        status: 'SUCCESS',
        message: `${removedContacts.length} Contact(s) Removed`
      };
    }
  },
  Contact: {
    events: (contact, args, { db }) => {
      return db
        .getEvents()
        .filter(({ involvedContacts }) =>
          involvedContacts.includes(contact.id)
        );
    }
  }
};
