import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Meta from './Meta';

const apolloClient = new ApolloClient({ uri: '/graphql' });

const colors = {
  red: '#FF0000',
  text: '#393939',
  background: '#FFFFFF',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED'
};
const theme = {
  ...colors,
  maxWidth: '425px'
};

const StyledPage = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const GlobalStyle = createGlobalStyle`
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,700);
  html {
    box-sizing: border-box;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.25;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
  }
`;

export default function Page({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <StyledPage>
            <Meta />
            <GlobalStyle />
            <Inner>{children}</Inner>
          </StyledPage>
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}
Page.propTypes = {
  children: PropTypes.node
};
