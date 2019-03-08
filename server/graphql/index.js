const { gql, makeExecutableSchema } = require('apollo-server-express');
const Contacts = require('./contacts');

const Query = gql`
  type Query {
    _empty: String
  }
`;
const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [Query, Mutation, Contacts.typeDefs],
  resolvers: {
    ...Contacts.resolvers
  }
});
