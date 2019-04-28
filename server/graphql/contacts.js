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
    communicationMethods: [CommunicationMethod!]!
    notes: [NoteStruct!]!
    favorite: Boolean
    events: [Event]!
  }
  type NoteStruct {
    label: String!
    value: String
  }

  input ContactInputData {
    name: String
    image: String
    birthday: DateStructInput
    communicationMethods: [CommunicationMethodInput!]
    notes: [NoteStructInput!]
    favorite: Boolean
  }
  input NoteStructInput {
    label: String!
    value: String
  }

  input ContactQueryData {
    id: ID
    name: String
    favorite: Boolean
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Contact: {
    events: async (contact, args, { db, user }) => {
      return db.Events.getAll(user.id, {
        involvedContacts: contact.id
      });
    }
  },
  Mutation: {
    addContact: async (obj, { data }, { db, user }) =>
      db.Contacts.create(user.id, { ...data, favorite: false }),
    removeContact: async (obj, { id }, { db, user }) => {
      const removedContact = await db.Contacts.delete(user.id, id);
      return {
        message: removedContact ? 'Contact Removed' : '',
        status: removedContact ? 'SUCCESS' : 'IGNORED'
      };
    },
    toggleFavoriteState: async (obj, { id }, { db, user }) => {
      const { favorite } = await db.Contacts.get(user.id, id);
      return db.Contacts.update(user.id, id, { favorite: !favorite });
    },
    updateContact: async (obj, { id, data }, { db, user }) =>
      db.Contacts.update(user.id, id, data)
  },
  Query: {
    contact: async (obj, { id }, { db, user }) => db.Contacts.get(user.id, id),
    contacts: async (obj, { query }, { db, user }) => {
      const contacts = await db.Contacts.getAll(user.id, query);
      return contacts;
    }
  }
};
