const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contacts(query: ContactQueryData = {}): [Contact]
  }
  extend type Mutation {
    addContact(data: ContactInputData): Contact
    removeContact(id: String!): Status
  }
  type Contact {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }
  input ContactInputData {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }
  input ContactQueryData {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    contacts: (obj, { query }, { db }) => db.getContacts(query)
  },
  Mutation: {
    addContact: (obj, { data }, { db }) => db.addContact(data),
    removeContact: (obj, { id }, { db }) => {
      const removedContacts = db.removeContact(id);
      return {
        status: 'SUCCESS',
        message: `${removedContacts.length} Contact(s) Removed`
      };
    }
  },
  Contact: {}
};
