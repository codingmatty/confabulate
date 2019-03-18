const { gql, makeExecutableSchema } = require('apollo-server-express');
const Contacts = require('./contacts');
const Events = require('./events');

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
const Common = gql`
  scalar Date
  enum StatusEnum {
    SUCCESS
    ERROR
  }
  type Status {
    status: StatusEnum!
    message: String
  }
`;

const typeDefs = [Query, Mutation, Common, Contacts.typeDefs, Events.typeDefs];
const resolvers = {
  ...Contacts.resolvers,
  ...Events.resolvers,
  Query: {
    ...Contacts.resolvers.Query,
    ...Events.resolvers.Query
  },
  Mutation: {
    ...Contacts.resolvers.Mutation,
    ...Events.resolvers.Mutation
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
