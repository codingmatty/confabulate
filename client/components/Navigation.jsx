import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import Drawer from './Drawer';

// const

const StyledNavigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: ${({ theme }) => theme.color.background};
  box-shadow: 0 0 10px -2px ${({ theme }) => theme.color.neutrals[5]};
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;
  z-index: 100;
`;

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <StyledNavigation>
        <button onClick={() => setDrawerOpen(!drawerOpen)}>Menu</button>
        <Dropdown
          renderTrigger={() => (
            <Avatar image="http://placecorgi.com/200" size={2} />
          )}
        >
          <Dropdown.Option href="/user">Account</Dropdown.Option>
          <Dropdown.Option href="/api/logout">Logout</Dropdown.Option>
        </Dropdown>
      </StyledNavigation>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
Navigation.propTypes = {};
