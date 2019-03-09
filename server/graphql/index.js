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
const Common = gql`
  enum StatusEnum {
    SUCCESS
    ERROR
  }
  type Status {
    status: StatusEnum!
    message: String
  }
`;

const typeDefs = [Query, Mutation, Common, Contacts.typeDefs];
const resolvers = {
  ...Contacts.resolvers
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
