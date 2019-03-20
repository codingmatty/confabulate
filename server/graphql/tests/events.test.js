const { ApolloServer, gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const db = require('../../db');
const schema = require('../index');

const user = { id: 1 };
const server = new ApolloServer({
  schema,
  context: () => ({ db, user })
});

const AllEventFields = gql`
  fragment AllEventFields on Event {
    id
    title
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
  mutation ADD_EVENT($data: EventInputData) {
    event: addEvent(data: $data) {
      ...AllEventFields
    }
  }
  ${AllEventFields}
`;

const UPDATE_EVENT = gql`
  mutation UPDATE_EVENT($id: ID!, $data: EventUpdateData) {
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

const seedData = {
  contacts: [{ id: '1' }, { id: '2' }, { id: '3' }],
  events: [
    {
      id: '1',
      title: 'Test Event 1',
      date: '2019-01-01T00:00:00.000Z',
      type: 'meeting',
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      involvedContacts: ['2', '3']
    },
    {
      id: '2',
      title: 'Test Event 2',
      date: '2019-02-01T00:00:00.000Z',
      type: 'lunch',
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      involvedContacts: []
    },
    {
      id: '3',
      title: 'Test Event 3',
      date: '2019-03-01T00:00:00.000Z',
      type: 'meeting',
      note: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu 
      orci malesuada, tincidunt turpis sed, tristique velit. Sed sed nunc 
      lectus. Donec porta pellentesque rhoncus.`,
      involvedContacts: ['2']
    }
  ]
};

describe('Events GraphQL', () => {
  const { query, mutate } = createTestClient(server);

  beforeEach(() => {
    db.resetDb(seedData);
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
      expect(data.events.map(({ type }) => type)).toEqual([
        'meeting',
        'meeting'
      ]);
      expect(data.events.map(({ id }) => id)).toEqual(['1', '3']);
    });
  });

  describe('query event', () => {
    it('renders all fields', async () => {
      const { data } = await query({
        query: QUERY_EVENT,
        variables: { id: '3' }
      });
      expect(data.event).toMatchSnapshot();
    });

    it('contains contacts', async () => {
      const { data } = await query({
        query: QUERY_EVENT,
        variables: { id: '1' }
      });
      expect(data.event.involvedContacts).toEqual([{ id: '2' }, { id: '3' }]);
    });
  });

  describe('add event', () => {
    it('can add event', async () => {
      const inputData = {
        title: 'New Test Event',
        date: new Date().toISOString(),
        type: 'party',
        note: 'Lorem Ipsum Dolor Sit Amet'
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
        title: 'New Test Event',
        date: new Date().toISOString(),
        involvedContacts: ['1']
      };
      const { data } = await mutate({
        mutation: ADD_EVENT,
        variables: { data: inputData }
      });
      expect(data.event).toMatchObject({
        ...inputData,
        involvedContacts: [{ id: '1' }]
      });
    });

    it('avoids adding invalid contacts to event', async () => {
      const inputData = {
        title: 'New Test Event',
        date: new Date().toISOString(),
        involvedContacts: ['100']
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
  });

  describe('update event', () => {
    it('updates specified fields', async () => {
      const updateData = {
        type: 'meetup',
        date: new Date().toISOString()
      };
      const { data } = await mutate({
        mutation: UPDATE_EVENT,
        variables: { id: '3', data: updateData }
      });
      expect(data.event).toMatchObject(updateData);
    });

    it('avoids adding invalid contacts to event', async () => {
      const updateData = {
        title: 'New Test Event',
        date: new Date().toISOString(),
        involvedContacts: ['100', '2']
      };
      const { data } = await mutate({
        mutation: UPDATE_EVENT,
        variables: { id: '3', data: updateData }
      });
      expect(data.event).toMatchObject({
        ...updateData,
        involvedContacts: [{ id: '2' }]
      });
    });
  });

  describe('remove event', () => {
    it('removes event', async () => {
      const { data } = await mutate({
        mutation: REMOVE_EVENT,
        variables: { id: '3' }
      });
      expect(data.status).toEqual({
        status: 'SUCCESS',
        message: '1 Event(s) Removed'
      });
      expect(db.getEvents()).toHaveLength(2);
    });

    it("avoids failure if event to remove doesn't exist", async () => {
      const { data } = await mutate({
        mutation: REMOVE_EVENT,
        variables: { id: '100' }
      });
      expect(data.status).toEqual({
        status: 'IGNORE',
        message: '0 Event(s) Removed'
      });
      expect(db.getEvents()).toHaveLength(3);
    });
  });
});
