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
    firstName: String!
    lastName: String
    friends: [Contact]
  }
  input ContactInputData {
    firstName: String!
    lastName: String
  }
  input ContactQueryData {
    firstName: String
    lastName: String
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
  Contact: {
    friends: (contact, args, { db }) =>
      contact.friends.map((friendId) => db.getContact(friendId))
  }
};
