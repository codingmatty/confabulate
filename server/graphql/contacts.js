const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contacts(query: ContactQuery): [Contact]
  }
  extend type Mutation {
    addContact(firstName: String!, lastName: String): Contact
    addFriend(id: String!, friendId: String!): Contact
  }
  type Contact {
    id: String!
    firstName: String!
    lastName: String
    friends: [Contact]
  }
  input ContactQuery {
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
    addContact: (obj, { firstName, lastName }, { db }) =>
      db.addContact({ firstName, lastName }),
    addFriend: (obj, { id, friendId }, { db }) => db.addFriend(id, friendId)
  },
  Contact: {
    friends: (contact, args, { db }) =>
      contact.friends.map((friendId) => db.getContact(friendId))
  }
};
