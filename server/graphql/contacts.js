const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contacts: [Contact]
  }
  type Contact {
    id: Int!
    firstName: String!
    lastName: String
    friends: [Contact]
  }
`;

const dbContacts = [
  {
    id: 1,
    firstName: 'Matt',
    lastName: 'Jacobs',
    friends: [2]
  },
  {
    id: 2,
    firstName: 'Logan',
    lastName: 'James',
    friends: []
  }
];

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    contacts: () => dbContacts
  },
  Contact: {
    friends: (contact) =>
      dbContacts.filter(({ id }) => contact.friends.includes(id))
  }
};
