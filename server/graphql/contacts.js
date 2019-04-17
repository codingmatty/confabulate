const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contact(id: ID!): Contact
    contacts(query: ContactQueryData = {}): [Contact]!
  }
  extend type Mutation {
    addContact(data: ContactInputData!): Contact
    updateContact(id: ID!, data: ContactInputData!): Contact
    toggleFavoriteState(id: ID!): Contact
    removeContact(id: ID!): Status
  }
  type Contact {
    id: ID!
    name: String
    image: String
    birthday: DateStruct!
    email: String
    phoneNumber: String
    favorite: Boolean
    events: [Event]!
  }
  input ContactInputData {
    name: String
    image: String
    birthday: DateStructInput
    email: String
    phoneNumber: String
    favorite: Boolean
  }
  input ContactQueryData {
    id: ID
    name: String
    birthday: DateStructInput
    email: String
    phoneNumber: String
    favorite: Boolean
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    contact: async (obj, { id }, { db, user }) =>
      await db.Contacts.get(user.id, id),
    contacts: async (obj, { query }, { db, user }) => {
      const contacts = await db.Contacts.getAll(user.id, query);
      return contacts;
    }
  },
  Mutation: {
    addContact: async (obj, { data }, { db, user }) =>
      await db.Contacts.create(user.id, { ...data, favorite: false }),
    updateContact: async (obj, { id, data }, { db, user }) =>
      await db.Contacts.update(user.id, id, data),
    toggleFavoriteState: async (obj, { id, data }, { db, user }) => {
      const { favorite } = await db.Contacts.get(user.id, id);
      return await db.Contacts.update(user.id, id, { favorite: !favorite });
    },
    removeContact: async (obj, { id }, { db, user }) => {
      const removedContact = await db.Contacts.delete(user.id, id);
      return {
        status: removedContact ? 'SUCCESS' : 'IGNORED',
        message: removedContact ? 'Contact Removed' : ''
      };
    }
  },
  Contact: {
    events: async (contact, args, { db, user }) => {
      return db.Events.getAll(user.id, {
        involvedContact: { id: contact.id }
      });
    }
  }
};
