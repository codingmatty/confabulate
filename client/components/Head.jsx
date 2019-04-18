import Head from 'next/head';

export default function AppHead() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#f7d070" />
      <link rel="manifest" href="/static/site.webmanifest" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="Confabulate" />
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/react-toastify.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="/static/pwa-install-prompt.css"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <title>Confabulate</title>
    </Head>
  );
}
