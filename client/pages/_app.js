import App, { Container } from 'next/app';
import Head from 'next/head';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

const apolloClient = new ApolloClient({ uri: '/graphql' });

class ConfabulateApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,700"
            rel="stylesheet"
          />
          <style>
            {`
              html {
                font-size: 16px;
                font-family: Roboto, sans-serif;
                line-height: 1.25;
              }
              body {
                padding: 0;
                margin: 0;
              }
            `}
          </style>
        </Head>
        <ApolloProvider client={apolloClient}>
          <ApolloHooksProvider client={apolloClient}>
            <Container>
              <Component {...pageProps} />
            </Container>
          </ApolloHooksProvider>
        </ApolloProvider>
      </>
    );
  }
}

export default ConfabulateApp;
