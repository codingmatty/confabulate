import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from './Link';

const StyledDrawer = styled.div`
  background-color: ${({ theme }) => theme.color.background};
  bottom: 0;
  box-shadow: 0 0 10px -2px ${({ theme }) => theme.color.neutrals[5]};
  left: -100%;
  padding: 5rem 1rem 1rem;
  position: fixed;
  top: 0;
  transition: left 500ms;
  width: 300px;
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
      <Link href="/contacts">Contacts</Link>
    </StyledDrawer>
  );
}
