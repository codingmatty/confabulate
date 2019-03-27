import App from 'next/app';
import Modal from 'react-modal';
import NProgress from 'nprogress';
import Router from 'next/router';
import Page from '../components/Page';

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

    ctx.isServer = Boolean(ctx.req);
    if (ctx.isServer) {
      // on server
      ctx.urlPrefix = `${ctx.req.protocol}://${ctx.req.get('Host')}`;
      ctx.url = ctx.urlPrefix + ctx.asPath;
    } else {
      // on client
      ctx.urlPrefix = '';
      ctx.url = window.location.href + ctx.asPath;
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <Page router={router}>
        <Component {...pageProps} />
      </Page>
    );
  }
}

export default ConfabulateApp;
