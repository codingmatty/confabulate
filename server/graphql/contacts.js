const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    contact(id: ID!): Contact
    contacts(query: ContactQueryData = {}): [Contact]!
  }
  extend type Mutation {
    addContact(data: ContactInputData): Contact
    updateContact(id: ID!, data: ContactInputData): Contact
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
      normalizeContact(await db.getContact(user.id, id)),
    contacts: async (obj, { query }, { db, user }) => {
      const contacts = await db.getContacts(user.id, query);
      return contacts.map(normalizeContact);
    }
  },
  Mutation: {
    addContact: async (obj, { data }, { db, user }) =>
      normalizeContact(
        await db.addContact(user.id, { ...data, favorite: false })
      ),
    updateContact: async (obj, { id, data }, { db, user }) =>
      normalizeContact(await db.updateContact(user.id, id, data)),
    removeContact: async (obj, { id }, { db, user }) => {
      const removedContact = await db.removeContact(user.id, id);
      return {
        status: removedContact ? 'SUCCESS' : 'IGNORE',
        message: `${removedContact.length} Contact(s) Removed`
      };
    }
  },
  Contact: {
    events: async (contact, args, { db, user }) => {
      const events = await db.getEvents(user.id);
      return events.filter(({ involvedContacts }) =>
        involvedContacts.includes(contact.id)
      );
    }
  }
};

function normalizeContact(contact) {
  console.log('contact: ', contact);
  return {
    ...contact,
    fullName: `${contact.firstName} ${contact.lastName}`
  };
}
