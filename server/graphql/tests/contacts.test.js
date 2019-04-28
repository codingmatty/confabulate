const { ApolloServer, gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const initDatabase = require('../../db');
const schema = require('../index');

const AllContactFields = gql`
  fragment AllContactFields on Contact {
    id
    name
    communicationMethods {
      label
      type
      value
    }
    favorite
    notes {
      label
      value
    }
    birthday {
      day
      month
      year
    }
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
  mutation ADD_CONTACT($data: ContactInputData!) {
    contact: addContact(data: $data) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const UPDATE_CONTACT = gql`
  mutation UPDATE_CONTACT($id: ID!, $data: ContactInputData!) {
    contact: updateContact(id: $id, data: $data) {
      ...AllContactFields
    }
  }
  ${AllContactFields}
`;

const TOGGLE_FAVORITE_STATE = gql`
  mutation TOGGLE_FAVORITE_STATE($id: ID!) {
    contact: toggleFavoriteState(id: $id) {
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

const user = { id: '5cbe7a1777201aa79d52fcc1' };
const seedData = {
  contacts: [
    {
      _id: '5cbe7a2a5e55d05aadfd38c1',
      birthday: {
        day: 23,
        month: 3,
        year: 2010
      },
      communicationMethods: [
        {
          label: 'Email',
          type: 'email',
          value: 'johnlennon@beatles.com'
        },
        {
          label: 'Phone',
          type: 'phone',
          value: '5551234567'
        }
      ],
      favorite: true,
      name: 'John Lennon',
      ownerId: user.id
    },
    {
      _id: '5cbe7a4816430674b1375ac2',
      birthday: {
        day: 23,
        month: 3
      },
      communicationMethods: [
        {
          label: 'Email',
          type: 'email',
          value: 'paulmccartney@beatles.com'
        },
        {
          label: 'Phone',
          type: 'phone',
          value: '5552345678'
        }
      ],
      favorite: false,
      name: 'Paul McCartney',
      notes: [
        {
          label: 'How did you meet?',
          value: 'Lorem ipsum dolor sit amet.'
        }
      ],
      ownerId: user.id
    },
    {
      _id: '5cbe7a52a7c6dd86a4b719c3',
      communicationMethods: [
        {
          label: 'Email',
          type: 'email',
          value: 'ringostarr@beatles.com'
        },
        {
          label: 'Phone',
          type: 'phone',
          value: '5553456789'
        }
      ],
      favorite: true,
      name: 'Ringo Starr',
      ownerId: user.id
    },
    {
      // This is a dummy for a different user
      _id: '5cbe7a62e299349e8b9a7ec4',
      ownerId: '5cbe7a58c668896ebfe887ce'
    }
  ],
  events: [
    {
      _id: '5cbe7a6cbcc4685e1341fce1',
      involvedContacts: ['5cbe7a4816430674b1375ac2'],
      ownerId: user.id
    }
  ]
};

describe('Contacts GraphQL', () => {
  let db;
  let mutate;
  let query;

  beforeAll(async () => {
    db = initDatabase(global.__MONGO_URI__);
    const server = new ApolloServer({
      context: () => ({ db, user }),
      schema
    });

    const testClient = createTestClient(server);
    mutate = testClient.mutate;
    query = testClient.query;
  });

  beforeEach(async () => {
    db.connection.dropDatabase();
    await db.Contacts.model.insertMany(seedData.contacts);
    await db.Events.model.insertMany(seedData.events);
  });

  afterAll(async () => {
    await db.connection.close();
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
      expect(data.contacts.map(({ id }) => id)).toEqual([
        '5cbe7a2a5e55d05aadfd38c1',
        '5cbe7a52a7c6dd86a4b719c3'
      ]);
    });
  });

  describe('query contact', () => {
    it('renders all fields', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.contact).toMatchSnapshot();
    });

    it('contains full name', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.contact).toHaveProperty('name', 'Ringo Starr');
    });

    it('contains events', async () => {
      const { data } = await query({
        query: QUERY_CONTACT,
        variables: { id: '5cbe7a4816430674b1375ac2' }
      });
      expect(data.contact.events).toEqual([{ id: '5cbe7a6cbcc4685e1341fce1' }]);
    });
  });

  describe('add contact', () => {
    it('can add contact', async () => {
      const inputData = {
        communicationMethods: [
          {
            label: 'Email',
            type: 'email',
            value: 'test@email.com'
          },
          {
            label: 'Phone',
            type: 'phone',
            value: '5551234567'
          }
        ],
        name: 'Test Test'
      };
      const { data } = await mutate({
        mutation: ADD_CONTACT,
        variables: { data: inputData }
      });
      expect(data.contact).toMatchObject({
        ...inputData,
        events: [],
        favorite: false,
        name: 'Test Test'
      });
    });
  });

  describe('update contact', () => {
    it('updates specified fields', async () => {
      const updateData = {
        communicationMethods: [
          {
            label: 'Email',
            type: 'email',
            value: 'test@email.com'
          }
        ],
        favorite: true
      };
      const { data } = await mutate({
        mutation: UPDATE_CONTACT,
        variables: { data: updateData, id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.contact).toMatchObject(updateData);
    });
  });

  describe('toggle favorite state', () => {
    it('updates favorite value', async () => {
      const { data } = await mutate({
        mutation: TOGGLE_FAVORITE_STATE,
        variables: { id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.contact).toHaveProperty('favorite', false);
      const { data: secondData } = await mutate({
        mutation: TOGGLE_FAVORITE_STATE,
        variables: { id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(secondData.contact).toHaveProperty('favorite', true);
    });
  });

  describe('remove contact', () => {
    it('removes contact', async () => {
      const { data } = await mutate({
        mutation: REMOVE_CONTACT,
        variables: { id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.status).toEqual({
        message: 'Contact Removed',
        status: 'SUCCESS'
      });
      const remainingContacts = await db.Contacts.getAll(user.id);
      expect(remainingContacts).toHaveLength(2);
    });

    it("avoids failure if contact to remove doesn't exist", async () => {
      const { data } = await mutate({
        mutation: REMOVE_CONTACT,
        variables: { id: '5cbe7a52a7c6dd86a4b70000' }
      });
      expect(data.status).toEqual({
        message: '',
        status: 'IGNORED'
      });
      const remainingContacts = await db.Contacts.getAll(user.id);
      expect(remainingContacts).toHaveLength(3);
    });
  });
});
