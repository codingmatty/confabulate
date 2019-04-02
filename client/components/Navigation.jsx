import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import Drawer from './Drawer';
import Icon from './Icon';

const QUERY_USER_IMAGE = gql`
  query QUERY_USER_IMAGE {
    user {
      email
      profile {
        image
      }
    }
  }
`;

const MenuButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: 2rem;
  display: flex;
`;

const StyledNavigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: ${({ theme }) => theme.color.background};
  border-bottom: 3px solid ${({ theme }) => theme.color.primary[2]};
  box-shadow: 0 0 10px -2px ${({ theme }) => theme.color.neutrals[5]};
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;
  z-index: 100;
`;

export default function Navigation() {
  const {
    data: { user = { profile: {} } }
  } = useQuery(QUERY_USER_IMAGE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <StyledNavigation>
        <MenuButton onClick={() => setDrawerOpen(!drawerOpen)}>
          <Icon type="menu" />
        </MenuButton>
        <Dropdown
          renderTrigger={() => (
            <Avatar image={user.profile.image} email={user.email} size={2} />
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
