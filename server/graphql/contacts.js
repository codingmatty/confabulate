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
    removeContact(id: ID!): Status
  }
  type Contact {
    id: ID!
    firstName: String
    lastName: String
    fullName: String
    email: String
    phoneNumber: String
    favorite: Boolean
    events: [Event]!
  }
  input ContactInputData {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    favorite: Boolean
  }
  input ContactQueryData {
    id: ID
    firstName: String
    lastName: String
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
      const contacts = await db.Contacts.query(user.id, query);
      return contacts;
    }
  },
  Mutation: {
    addContact: async (obj, { data }, { db, user }) =>
      await db.Contacts.create(user.id, { ...data, favorite: false }),
    updateContact: async (obj, { id, data }, { db, user }) =>
      await db.Contacts.update(user.id, id, data),
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
      return db.Events.query(user.id, { involvedContact: { id: contact.id } });
    }
  }
};
