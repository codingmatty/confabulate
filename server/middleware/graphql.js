const { Router } = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('../graphql');

module.exports = function registerGraphQL(db) {
  const router = new Router();
  const graphQLPath = '/graphql';

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ db, user: req.user }),
    playground: process.env.NODE_ENV === 'development' && {
      settings: {
        ['request.credentials']: 'include'
      }
    }
  });

  // Require authentication for the GraphQL endpoint(s)
  router.use(graphQLPath, (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      next();
      return;
    }
    if (req.method === 'POST') {
      res.status(401).json({ message: 'Unauthenticated' });
    } else {
      res.status(401).redirect('/login');
    }
  });

  server.applyMiddleware({ app: router, path: graphQLPath });

  return router;
};
