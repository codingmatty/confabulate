const { ApolloServer, gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const initDatabase = require('../../db');
const schema = require('../index');

const AllUserFields = gql`
  fragment AllUserFields on User {
    id
    email
    authProviders
    profile {
      image
      name
    }
  }
`;

const QUERY_USER = gql`
  query QUERY_USER {
    user {
      ...AllUserFields
    }
  }
  ${AllUserFields}
`;

const UPDATE_USER_PROFILE = gql`
  mutation UPDATE_USER_PROFILE($data: ProfileUpdateData!) {
    user: updateUserProfile(data: $data) {
      ...AllUserFields
    }
  }
  ${AllUserFields}
`;

const seedData = {
  users: [
    {
      _id: '5cbe7a1777201aa79d52fcf1',
      authProviders: ['google'],
      email: 'test@email.com',
      profile: {
        image: 'https://avatar.com/1',
        name: 'Some Name'
      }
    },
    {
      _id: '5cbe7a1777201aa79d52fcf2',
      authProviders: ['password'],
      email: 'test2@email.com',
      profile: {
        image: 'https://avatar.com/2',
        name: 'Some Name 2'
      }
    }
  ]
};

describe('User GraphQL', () => {
  let db;
  let mutate;
  let query;

  beforeAll(async () => {
    db = initDatabase(global.__MONGO_URI__);
    const server = new ApolloServer({
      context: () => ({ db, user: { id: '5cbe7a1777201aa79d52fcf1' } }),
      schema
    });

    const testClient = createTestClient(server);
    mutate = testClient.mutate;
    query = testClient.query;
  });

  beforeEach(async () => {
    db.connection.dropDatabase();
    await db.Users.model.insertMany(seedData.users);
  });

  afterAll(async () => {
    await db.connection.close();
  });

  describe('query user', () => {
    it('renders all fields', async () => {
      const { data } = await query({
        query: QUERY_USER
      });
      expect(data.user).toMatchSnapshot();
    });
  });

  describe('update user', () => {
    it('updates the user profile', async () => {
      const updateData = {
        name: 'Test Name Update'
      };
      const { data } = await mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: { data: updateData, id: '5cbe7a52a7c6dd86a4b719c3' }
      });
      expect(data.user).toMatchObject({ profile: updateData });
    });
  });
});
