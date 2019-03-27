import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from './Link';
import Icon from './Icon';

const StyledLink = styled(Link)`
  width: 100%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`;
const StyledIcon = styled(Icon)`
  margin-right: 0.5rem;
`;

const StyledDrawer = styled.div`
  background: ${({ theme }) => theme.color.neutrals[0]};
  border-right: 3px solid ${({ theme }) => theme.color.primary[2]};
  bottom: 0;
  box-shadow: 0 0 10px -2px ${({ theme }) => theme.color.neutrals[5]};
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

export default function Drawer({ isOpen, onClose }) {
  const drawerRef = useRef(null);
  Router.events.on('routeChangeStart', () => onClose(false));

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
      <StyledLink href="/contacts">
        <StyledIcon type="people" />
        Contacts
      </StyledLink>
    </StyledDrawer>
  );
}
