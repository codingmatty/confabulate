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
    isImported: Boolean
    birthday: DateStruct!
    communicationMethods: [CommunicationMethod!]!
  }

  input GoogleContactQueryData {
    id: ID
    name: String
    isImported: Boolean
    birthday: DateStructInput
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Mutation: {
    importGoogleContacts: async (obj, { selectedIds }, { db, user }) => {
      const contactsToImport = (await db.GoogleContacts.getAll(user.id, {
        _id: { $in: selectedIds }
      })).map((contact) => ({
        ...contact,
        source: { id: contact.peopleId, type: 'google' }
      }));

      const createdContacts =
        (await db.Contacts.create(user.id, contactsToImport)) || [];

      // Remove temporarily stored google contacts
      await db.GoogleContacts.deleteMany(user.id);

      return {
        message: `${createdContacts.length} Contacts Imported`,
        status: createdContacts.length ? 'SUCCESS' : 'IGNORED'
      };
    }
  },
  Query: {
    googleContacts: async (obj, args, { db, user }) =>
      db.GoogleContacts.getAll(user.id)
  }
};
