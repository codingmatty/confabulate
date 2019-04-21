import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from './Link';
import Icon from './Icon';

const StyledLink = styled(Link)`
  font-size: 1.25rem;
  display: inline-flex;
  align-items: center;
  border-bottom: 2px solid transparent;

  &:not(:first-child) {
    margin-top: 0.5rem;
  }

  ${({ selected, theme }) =>
    selected
      ? `
    cursor: default;
    border-bottom: 2px solid ${theme.color.oranges[2]};
  `
      : `
  &:hover {
    border-bottom: 2px solid ${theme.color.oranges[1]};
  }
  `};
`;
const StyledIcon = styled(Icon)`
  margin-right: 0.5rem;
`;

const StyledDrawer = styled.div`
  align-items: baseline;
  background: ${({ theme }) => theme.color.neutrals[0]};
  bottom: 0;
  box-shadow: 0 0 10px -2px ${({ theme }) => theme.color.neutrals[5]};
  display: flex;
  flex-direction: column;
  left: -100%;
  padding: 6rem 2rem 2rem;
  position: fixed;
  top: 0;
  transition: left 500ms;
  width: 200px;
  z-index: 10;

  &.open {
    left: 0;
  }
`;

function Drawer({ isOpen, onClose, router }) {
  const drawerRef = useRef(null);
  const [currentPath, setCurrentPath] = useState(router.asPath);

  useEffect(() => {
    if (router.asPath !== currentPath) {
      onClose();
      setCurrentPath(router.asPath);
    }
  }, [router.asPath]);

  const handleWindowClick = (e) => {
    if (isOpen && !drawerRef.current.contains(e.target)) {
      onClose();
      window.removeEventListener('click', handleWindowClick);
    }
  };
  // On outside click
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      window.addEventListener('click', handleWindowClick);
      return () => window.removeEventListener('click', handleWindowClick);
    }
  });

  return (
    <StyledDrawer
      aria-hidden={isOpen}
      className={`${isOpen ? 'open' : ''}`}
      ref={drawerRef}
    >
      <StyledLink href="/contacts" selected={router.asPath === '/contacts'}>
        <StyledIcon type="people" />
        Contacts
      </StyledLink>
      <StyledLink href="/events" selected={router.asPath === '/events'}>
        <StyledIcon type="calendar_today" />
        Events
      </StyledLink>
    </StyledDrawer>
  );
}
Drawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  router: PropTypes.shape({
    asPath: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Drawer);
