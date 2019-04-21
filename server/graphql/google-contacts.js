const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    googleContacts(query: GoogleContactQueryData = {}): [GoogleContact]!
  }
  extend type Mutation {
    importGoogleContacts(selectedIds: [String!]!): Status
  }
  type GoogleContact {
    id: ID!
    name: String
    image: String
    birthday: DateStruct!
    email: String
    phoneNumber: String
  }
  input GoogleContactQueryData {
    id: ID
    name: String
    birthday: DateStructInput
    email: String
    phoneNumber: String
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    googleContacts: async (obj, args, { db, user }) =>
      db.GoogleContacts.getAll(user.id)
  },
  Mutation: {
    importGoogleContacts: async (obj, { selectedIds }, { db, user }) => {
      const contactsToImport = (await db.GoogleContacts.getAll(user.id, {
        _id: { $in: selectedIds }
      })).map((contact) => ({
        ...contact,
        source: { type: 'google', id: contact.peopleId }
      }));

      const createdContacts =
        (await db.Contacts.create(user.id, contactsToImport)) || [];

      // Remove temporarily stored google contacts
      await db.GoogleContacts.deleteMany(user.id);

      return {
        status: createdContacts.length ? 'SUCCESS' : 'IGNORED',
        message: `${createdContacts.length} Contacts Imported`
      };
    }
  }
};
