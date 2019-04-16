import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '../utils/theme';
import Meta from './Meta';
import Navigation from './Navigation';

const StyledPage = styled.div`
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
  min-height: ${({ withNav }) => (withNav ? 'calc(100vh - 4rem)' : '100%')};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: ${({ withNav }) => (withNav ? '4rem auto 0' : '0 auto')};
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

export default function Page({ children, router }) {
  const shouldRenderNav = !['/login', '/signup'].includes(router.pathname);
  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <Meta />
        <GlobalStyle />
        {shouldRenderNav && <Navigation />}
        <Inner withNav={shouldRenderNav}>{children}</Inner>
      </StyledPage>
    </ThemeProvider>
  );
}
Page.propTypes = {
  children: PropTypes.node,
  router: PropTypes.object
};
