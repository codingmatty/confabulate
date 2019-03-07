const { gql, makeExecutableSchema } = require('apollo-server-express');
const Contacts = require('./contacts');

// Construct a schema, using GraphQL schema language
const Query = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  ...Contacts.resolvers
};

module.exports = makeExecutableSchema({
  typeDefs: [Query, Contacts.typeDefs],
  resolvers
});
