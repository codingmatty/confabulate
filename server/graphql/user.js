const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    user: User!
  }
  extend type Mutation {
    # updateEmail(email: String!): User
    updateProfile(data: ProfileUpdateData!): User
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
    firstName: String
    lastName: String
  }
  # type Settings {
  # }
  input ProfileUpdateData {
    firstName: String
    lastName: String
  }
  # input SettingsUpdateData {
  # }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    user: async (obj, args, { db, user }) => await db.getUser(user.id)
  },
  Mutation: {
    // updateEmail: async (obj, { email }, { db, user }) =>
    //   await db.updateUser(user.id, { email }),
    updateProfile: async (obj, { data }, { db, user }) =>
      await db.updateUser(user.id, { profile: data })
    // updateSettings: async (obj, { data }, { db, user }) =>
    //   await db.updateUser(user.id, { settings: data })
  }
};
