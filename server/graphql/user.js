const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    user: User!
  }
  extend type Mutation {
    # updateEmail(email: String!): User
    updateUserProfile(data: ProfileUpdateData!): User
    # updateSettings(data: SettingsUpdateData!): User
  }
  type User {
    id: ID!
    email: String!
    authProviders: [String!]!
    profile: Profile!
    # settings: Settings!
  }
  type Profile {
    image: String
    name: String
  }
  # type Settings {
  # }
  input ProfileUpdateData {
    image: String
    name: String
  }
  # input SettingsUpdateData {
  # }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Mutation: {
    // updateEmail: async (obj, { email }, { db, user }) =>
    //  db.Users.update(user.id, { email }),
    updateUserProfile: async (obj, { data }, { db, user }) =>
      db.Users.update(user.id, { profile: data })
    // updateSettings: async (obj, { data }, { db, user }) =>
    //  db.Users.update(user.id, { settings: data })
  },
  Query: {
    user: async (obj, args, { db, user }) => db.Users.get(user.id)
  }
};
