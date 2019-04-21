import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { SchemaLink } from 'apollo-link-schema';

let apolloClient = null;

function create({ context: { schema, ...context } = {}, initialState }) {
  let link = new HttpLink({
    uri: `/graphql`,
    credentials: 'same-origin'
  });
  if (!process.browser) {
    link = new SchemaLink({ schema, context });
  }
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo({ context, initialState }) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create({ context, initialState });
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create({ context, initialState });
  }

  return apolloClient;
}
