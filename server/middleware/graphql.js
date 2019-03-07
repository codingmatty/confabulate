const { Router } = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
};

module.exports = function registerGraphQL(db) {
  const router = new Router();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db },
    playground: process.env.NODE_ENV === 'development' && {
      settings: {
        ['request.credentials']: 'include'
      }
    }
  });

  // Require authentication for the GraphQL endpoint(s)
  router.use('/graphql', (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      next();
      return;
    }
    res.status(401).json({ message: 'Unauthenticated' });
  });

  server.applyMiddleware({ app: router });

  return router;
};
