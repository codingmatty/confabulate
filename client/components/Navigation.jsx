import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Router from 'next/router';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

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
  justify-content: flex-end;
  padding: 0 1rem;
  align-items: center;
`;

export default function Navigation({}) {
  return (
    <StyledNavigation>
      <Dropdown
        renderTrigger={() => (
          <Avatar image="http://placecorgi.com/200" size={2} />
        )}
      >
        <Dropdown.Option href="/user">Account</Dropdown.Option>
        <Dropdown.Option href="/api/logout">Logout</Dropdown.Option>
      </Dropdown>
    </StyledNavigation>
  );
}
Navigation.propTypes = {};
