import App from 'next/app';
import Modal from 'react-modal';
import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import HoneybadgerWrapper, {
  SetHoneybadgerContext
} from '../components/HoneybadgerWrapper';
import Head from '../components/Head';
import Page from '../components/Page';
import withApolloClient from '../utils/with-apollo-client';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

Modal.setAppElement('#__next');

class ConfabulateApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let gqlContext = {};

    ctx.isServer = !process.browser;
    if (ctx.isServer) {
      // on server
      ctx.urlPrefix = `${ctx.req.protocol}://${ctx.req.get('Host')}`;
      ctx.url = ctx.urlPrefix + ctx.asPath;
      gqlContext = ctx.req.apolloClientContext;
    } else {
      // on client
      ctx.urlPrefix = '';
      ctx.url = window.location.href + ctx.asPath;
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, gqlContext };
  }

  render() {
    const { Component, pageProps, router, apolloClient } = this.props;

    const isLoggedIn = !['/login', '/signup'].includes(router.pathname);

    return (
      <>
        <Head />
        <HoneybadgerWrapper>
          <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
              <Page isLoggedIn={isLoggedIn}>
                <Component {...pageProps} />
              </Page>
              <SetHoneybadgerContext key={isLoggedIn} />
            </ApolloHooksProvider>
          </ApolloProvider>
        </HoneybadgerWrapper>
      </>
    );
  }
}

export default withApolloClient(ConfabulateApp);
