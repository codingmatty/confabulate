import Head from 'next/head';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getMarkupFromTree } from 'react-apollo-hooks';
import initApollo from './init-apollo';

export default (App) => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)';
    static async getInitialProps(ctx) {
      const { Component, router } = ctx;

      const { gqlContext, ...appProps } = App.getInitialProps
        ? await App.getInitialProps(ctx)
        : {};

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo({ context: gqlContext });
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: (
              <App
                {...appProps}
                Component={Component}
                router={router}
                apolloClient={apollo}
              />
            )
          });
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          /* eslint-disable-next-line no-console */
          console.error('Error while running `getMarkupFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    constructor(props) {
      super(props);
      this.apolloClient = initApollo({
        // eslint-disable-next-line react/prop-types
        initialState: props.apolloState
      });
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
