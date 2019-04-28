const { gql, makeExecutableSchema } = require('apollo-server-express');
const User = require('./user');
const Contacts = require('./contacts');
const GoogleContacts = require('./google-contacts');
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
    IGNORED
  }
  enum CommunicationMethodType {
    email
    phone
    social
    address
  }

  type CommunicationMethod {
    type: CommunicationMethodType!
    label: String!
    value: String
  }
  type DateStruct {
    day: Int
    month: Int
    year: Int
  }
  type Status {
    status: StatusEnum!
    message: String
  }

  input CommunicationMethodInput {
    type: CommunicationMethodType!
    label: String!
    value: String
  }
  input DateStructInput {
    day: Int
    month: Int
    year: Int
  }
`;

const typeDefs = [
  Query,
  Mutation,
  Common,
  User.typeDefs,
  Contacts.typeDefs,
  GoogleContacts.typeDefs,
  Events.typeDefs
];
const resolvers = {
  ...User.resolvers,
  ...Contacts.resolvers,
  ...GoogleContacts.resolvers,
  ...Events.resolvers,
  Query: {
    ...User.resolvers.Query,
    ...Contacts.resolvers.Query,
    ...GoogleContacts.resolvers.Query,
    ...Events.resolvers.Query
  },
  Mutation: {
    ...User.resolvers.Mutation,
    ...Contacts.resolvers.Mutation,
    ...GoogleContacts.resolvers.Mutation,
    ...Events.resolvers.Mutation
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
