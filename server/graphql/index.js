const { gql, makeExecutableSchema } = require('apollo-server-express');
const Contacts = require('./contacts');
const Meetings = require('./meetings');

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

const typeDefs = [
  Query,
  Mutation,
  Common,
  Contacts.typeDefs,
  Meetings.typeDefs
];
const resolvers = {
  ...Contacts.resolvers,
  ...Meetings.resolvers,
  Query: {
    ...Contacts.resolvers.Query,
    ...Meetings.resolvers.Query
  },
  Mutation: {
    ...Contacts.resolvers.Mutation,
    ...Meetings.resolvers.Mutation
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
