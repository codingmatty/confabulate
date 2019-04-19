import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import theme from '../utils/theme';
import Navigation from './Navigation';
import InstallPrompt from './InstallPrompt';

const StyledPage = styled.div`
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
  min-height: ${({ withNav }) => (withNav ? 'calc(100vh - 4rem)' : '100%')};
`;

const Inner = styled.div`
  margin: 4rem auto 0;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 1rem 1.5rem 2rem;
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
    color: ${({ theme }) => theme.color.text};
  }
`;

export default function Page({ children, isLoggedIn }) {
  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <GlobalStyle />
        <Navigation key={isLoggedIn} isLoggedIn={isLoggedIn} />
        <Inner>{children}</Inner>
        <ToastContainer />
        <InstallPrompt />
      </StyledPage>
    </ThemeProvider>
  );
}
Page.propTypes = {
  children: PropTypes.node,
  isLoggedIn: PropTypes.bool
};
