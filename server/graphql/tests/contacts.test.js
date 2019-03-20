const { ApolloServer, gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const db = require('../../db');
const schema = require('../index');

const user = { id: 1 };
const server = new ApolloServer({
  schema,
  context: () => ({ db, user })
});

const AllContactFields = gql`
  fragment AllContactFields on Contact {
    id
    firstName
    lastName
    fullName
    email
    phoneNumber
    favorite
    events {
      id
    }
  }
`;

const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS($query: ContactQueryData) {
    contacts(query: $query) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const QUERY_CONTACT = gql`
  query QUERY_CONTACT($id: ID!) {
    contact(id: $id) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const ADD_CONTACT = gql`
  mutation ADD_CONTACT($data: ContactInputData) {
    contact: addContact(data: $data) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const UPDATE_CONTACT = gql`
  mutation UPDATE_CONTACT($id: ID!, $data: ContactInputData) {
    contact: updateContact(id: $id, data: $data) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const REMOVE_CONTACT = gql`
  mutation REMOVE_CONTACT($id: ID!) {
    status: removeContact(id: $id) {
      status
      message
    }
  }
`;

const seedData = {
  contacts: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Lennon',
      email: 'johnlennon@beatles.com',
      phoneNumber: '5551234567',
      favorite: true
    },
    {
      id: '2',
      firstName: 'Paul',
      lastName: 'McCartney',
      email: 'paulmccartney@beatles.com',
      phoneNumber: '5552345678',
      favorite: false
    },
    {
      id: '3',
      firstName: 'Ringo',
      lastName: 'Starr',
      email: 'ringostarr@beatles.com',
      phoneNumber: '5553456789',
      favorite: true
    }
  ],
  events: [
    {
      id: '1',
      involvedContacts: ['2']
    }
  ]
};

describe('Contacts GraphQL', () => {
  const { query, mutate } = createTestClient(server);

  beforeEach(() => {
    db.resetDb(seedData);
  });

  describe('query contacts', () => {
    it('renders all fields for all data', async () => {
      const { data } = await query({
        query: QUERY_CONTACTS
      });
      expect(data.contacts).toMatchSnapshot();
    });

    it('queries all favorite contacts', async () => {
      const { data } = await query({
        query: QUERY_CONTACTS,
        variables: { query: { favorite: true } }
      });
      expect(data.contacts).toHaveLength(2);
      expect(data.contacts.map(({ favorite }) => favorite)).toEqual([
        true,
        true
      ]);
      expect(data.contacts.map(({ id }) => id)).toEqual(['1', '3']);
    });
  });

  describe('query contact', () => {
    it('renders all fields', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '3' }
      });
      expect(data.contact).toMatchSnapshot();
    });

    it('contains full name', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '3' }
      });
      expect(data.contact).toHaveProperty('fullName', 'Ringo Starr');
    });

    it('contains events', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '2' }
      });
      expect(data.contact.events).toEqual([{ id: '1' }]);
    });
  });

  describe('add contact', () => {
    it('can add contact', async () => {
      const inputData = {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@email.com',
        phoneNumber: '5551234567'
      };
      const { data } = await mutate({
        mutation: ADD_CONTACT,
        variables: { data: inputData }
      });
      expect(data.contact).toMatchObject({
        ...inputData,
        fullName: 'Test Test',
        favorite: false,
        events: []
      });
    });
  });

  describe('update contact', () => {
    it('updates specified fields', async () => {
      const updateData = {
        email: 'test@email.com',
        favorite: true
      };
      const { data } = await mutate({
        mutation: UPDATE_CONTACT,
        variables: { id: '3', data: updateData }
      });
      expect(data.contact).toMatchObject(updateData);
    });
  });

  describe('remove contact', () => {
    it('removes contact', async () => {
      const { data } = await mutate({
        mutation: REMOVE_CONTACT,
        variables: { id: '3' }
      });
      expect(data.status).toEqual({
        status: 'SUCCESS',
        message: '1 Contact(s) Removed'
      });
      expect(db.getContacts()).toHaveLength(2);
    });

    it("avoids failure if contact to remove doesn't exist", async () => {
      const { data } = await mutate({
        mutation: REMOVE_CONTACT,
        variables: { id: '100' }
      });
      expect(data.status).toEqual({
        status: 'IGNORE',
        message: '0 Contact(s) Removed'
      });
      expect(db.getContacts()).toHaveLength(3);
    });
  });
});
