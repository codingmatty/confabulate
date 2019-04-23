const { ApolloServer, gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const initDatabase = require('../../db');
const schema = require('../index');

const AllEventFields = gql`
  fragment AllEventFields on Event {
    id
    date
    type
    note
    involvedContacts {
      id
    }
  }
`;

const QUERY_EVENTS = gql`
  query QUERY_EVENTS($query: EventQueryData) {
    events(query: $query) {
      ...AllEventFields
    }
  }
  ${AllEventFields}
`;

const QUERY_EVENT = gql`
  query QUERY_EVENT($id: ID!) {
    event(id: $id) {
      ...AllEventFields
    }
  }
  ${AllEventFields}
`;

const ADD_EVENT = gql`
  mutation ADD_EVENT($data: EventInputData!) {
    event: addEvent(data: $data) {
      ...AllEventFields
    }
  }
  ${AllEventFields}
`;

const UPDATE_EVENT = gql`
  mutation UPDATE_EVENT($id: ID!, $data: EventUpdateData!) {
    event: updateEvent(id: $id, data: $data) {
      ...AllEventFields
    }
  }
  ${AllEventFields}
`;

const REMOVE_EVENT = gql`
  mutation REMOVE_EVENT($id: ID!) {
    status: removeEvent(id: $id) {
      status
      message
    }
  }
`;

const user = { id: '5cbf91a5b32bb3b358c11bf1' };
const seedData = {
  contacts: [
    {
      _id: '5cbf91a5b32bb3b358c11bc1',
      ownerId: user.id
    },
    {
      _id: '5cbf91a5b32bb3b358c11bc2',
      ownerId: user.id
    },
    {
      _id: '5cbf91a5b32bb3b358c11bc3',
      ownerId: user.id
    }
  ],
  events: [
    {
      _id: '5cbf91a5b32bb3b358c11be1',
      date: '2019-01-01T00:00:00.000Z',
      involvedContacts: [
        '5cbf91a5b32bb3b358c11bc2',
        '5cbf91a5b32bb3b358c11bc3',
        '5cbf91a5b32bb3b358c11bff'
      ],
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      ownerId: user.id,
      type: 'meeting'
    },
    {
      _id: '5cbf91a5b32bb3b358c11be2',
      date: '2019-02-01T00:00:00.000Z',
      involvedContacts: [],
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      ownerId: user.id,
      type: 'lunch'
    },
    {
      _id: '5cbf91a5b32bb3b358c11be3',
      date: '2019-03-01T00:00:00.000Z',
      involvedContacts: ['5cbf91a5b32bb3b358c11bc2'],
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      ownerId: user.id,
      type: 'meeting'
    },
    {
      _id: '5cbf91a5b32bb3b358c11be4',
      ownerId: '5cbf91a5b32bb3b358c11bf2'
    }
  ]
};

describe('Events GraphQL', () => {
  let db;
  let mutate;
  let query;

  beforeAll(async () => {
    db = initDatabase(process.env.MONGO_URL);
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

  describe('query events', () => {
    it('renders all fields for all data', async () => {
      const { data } = await query({
        query: QUERY_EVENTS
      });
      expect(data.events).toMatchSnapshot();
    });

    it('queries all events with meeting type', async () => {
      const { data } = await query({
        query: QUERY_EVENTS,
        variables: { query: { type: 'meeting' } }
      });
      expect(data.events).toHaveLength(2);
      expect(data.events.every(({ type }) => type === 'meeting')).toBeTruthy();
      expect(data.events.map(({ id }) => id)).toEqual([
        '5cbf91a5b32bb3b358c11be1',
        '5cbf91a5b32bb3b358c11be3'
      ]);
    });

    it('queries all events by contact', async () => {
      const { data } = await query({
        query: QUERY_EVENTS,
        variables: {
          query: { involvedContact: { id: '5cbf91a5b32bb3b358c11bc2' } }
        }
      });
      expect(data.events).toHaveLength(2);
      expect(
        data.events.every(({ involvedContacts }) =>
          involvedContacts.some(({ id }) => id === '5cbf91a5b32bb3b358c11bc2')
        )
      ).toBeTruthy();
      expect(data.events.map(({ id }) => id)).toEqual([
        '5cbf91a5b32bb3b358c11be1',
        '5cbf91a5b32bb3b358c11be3'
      ]);
    });
  });

  describe('query event', () => {
    it('renders all fields', async () => {
      const { data } = await query({
        query: QUERY_EVENT,
        variables: { id: '5cbf91a5b32bb3b358c11be3' }
      });
      expect(data.event).toMatchSnapshot();
    });

    it('contains valid contacts', async () => {
      const { data } = await query({
        query: QUERY_EVENT,
        variables: { id: '5cbf91a5b32bb3b358c11be1' }
      });
      expect(data.event.involvedContacts).toEqual([
        { id: '5cbf91a5b32bb3b358c11bc2' },
        { id: '5cbf91a5b32bb3b358c11bc3' }
      ]);
    });
  });

  describe('add event', () => {
    it('can add event', async () => {
      const inputData = {
        date: new Date(),
        note: 'Lorem Ipsum Dolor Sit Amet',
        type: 'party'
      };
      const { data } = await mutate({
        mutation: ADD_EVENT,
        variables: { data: inputData }
      });
      expect(data.event).toMatchObject({
        ...inputData,
        involvedContacts: []
      });
    });

    it('can add event with contacts', async () => {
      const inputData = {
        date: new Date(),
        involvedContacts: ['5cbf91a5b32bb3b358c11bc1']
      };
      const { data } = await mutate({
        mutation: ADD_EVENT,
        variables: { data: inputData }
      });
      expect(data.event).toMatchObject({
        ...inputData,
        involvedContacts: [{ id: '5cbf91a5b32bb3b358c11bc1' }]
      });
    });
  });

  describe('update event', () => {
    it('updates specified fields', async () => {
      const updateData = {
        date: new Date(),
        type: 'meetup'
      };
      const { data } = await mutate({
        mutation: UPDATE_EVENT,
        variables: { data: updateData, id: '5cbf91a5b32bb3b358c11be3' }
      });
      expect(data.event).toMatchObject(updateData);
    });
  });

  describe('remove event', () => {
    it('removes event', async () => {
      const { data } = await mutate({
        mutation: REMOVE_EVENT,
        variables: { id: '5cbf91a5b32bb3b358c11be3' }
      });
      expect(data.status).toEqual({
        message: 'Event Removed',
        status: 'SUCCESS'
      });
      const remainingEvents = await db.Events.getAll(user.id);
      expect(remainingEvents).toHaveLength(2);
    });

    it("avoids failure if event to remove doesn't exist", async () => {
      const { data } = await mutate({
        mutation: REMOVE_EVENT,
        variables: { id: '5cbf91a5b32bb3b358c11bff' }
      });
      expect(data.status).toEqual({
        message: '',
        status: 'IGNORED'
      });
      const remainingEvents = await db.Events.getAll(user.id);
      expect(remainingEvents).toHaveLength(3);
    });
  });
});
