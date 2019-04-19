import ErrorBoundary from '@honeybadger-io/react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { useEffect } from 'react';

export default function HoneybadgerWrapper({ children }) {
  if (process.browser && window.Honeybadger) {
    const honeybadger = window.Honeybadger.configure({
      api_key: process.env.HONEYBADGER_API_KEY,
      environment: process.env.NODE_ENV
    });
    window.Honeybadger.setContext({
      tags: 'client'
    });
    return <ErrorBoundary honeybadger={honeybadger}>{children}</ErrorBoundary>;
  }
  return children;
}

const QUERY_USER = gql`
  query QUERY_USER {
    user {
      id
      email
    }
  }
`;

export function SetHoneybadgerContext() {
  const {
    data: { user }
  } = useQuery(QUERY_USER);

  useEffect(() => {
    if (user && window.Honeybadger) {
      window.Honeybadger.setContext({
        user_id: user.id,
        user_email: user.email
      });
    }
  }, [user, process.browser ? window.Honeybadger : null]);

  return null;
}
