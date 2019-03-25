const { gql, makeExecutableSchema } = require('apollo-server-express');
const User = require('./user');
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
    IGNORE
  }
  type Status {
    status: StatusEnum!
    message: String
  }
`;

const typeDefs = [
  Query,
  Mutation,
  Common,
  User.typeDefs,
  Contacts.typeDefs,
  Events.typeDefs
];
const resolvers = {
  ...User.resolvers,
  ...Contacts.resolvers,
  ...Events.resolvers,
  Query: {
    ...User.resolvers.Query,
    ...Contacts.resolvers.Query,
    ...Events.resolvers.Query
  },
  Mutation: {
    ...User.resolvers.Mutation,
    ...Contacts.resolvers.Mutation,
    ...Events.resolvers.Mutation
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
