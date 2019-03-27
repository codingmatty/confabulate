import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  cloneElement,
  Children
} from 'react';
import styled, { css } from 'styled-components';
import Router from 'next/router';
import Link from './Link';

const optionStyles = css`
  padding: 0.25rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  display: block;
  &:hover {
    background-color: ${({ theme }) => theme.color.neutrals[2]};
  }
`;
const MenuOption = styled.button`
  background: none;
  outline: none;
  padding: 0;
  border: 0;
  ${optionStyles}
`;
const MenuLink = styled(Link)`
  ${optionStyles}
`;
const MenuItem = styled.li``;
const Menu = styled.ul`
  position: absolute;
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  right: 0;
  top: calc(100% + 4px);
  background-color: ${({ theme }) => theme.color.background};
  border: 1px solid ${({ theme }) => theme.color.neutrals[5]};
  border-radius: 4px;

  &::before,
  &::after {
    content: '';
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    position: absolute;
    right: ${({ triggerWidth }) => triggerWidth / 2 - 7}px;
  }
  &::before {
    border-bottom: 5px solid ${({ theme }) => theme.color.neutrals[5]};
    bottom: 100%;
  }
  &::after {
    border-bottom: 5px solid ${({ theme }) => theme.color.background};
    bottom: calc(100% - 1px);
  }
`;
const Trigger = styled.button`
  background: none;
  padding: 0;
  border: none;
  display: flex;
  cursor: pointer;
`;
const DropdownContainer = styled.div`
  position: relative;
`;

function DropdownOption({ href, children, value, onClick, onChange }) {
  return href ? (
    <MenuLink href={href}>{children}</MenuLink>
  ) : (
    <MenuOption
      onClick={(e) => {
        onClick(e);
        if (!e.isDefaultPrevented()) {
          onChange(value);
        }
      }}
    >
      {children}
    </MenuOption>
  );
}

export default function Dropdown({ children, renderTrigger, onChange }) {
  const triggerRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    const closeDropdown = () => setOpen(false);
    Router.events.on('routeChangeStart', closeDropdown);
    return () => Router.events.off('routeChangeStart', closeDropdown);
  });

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.getBoundingClientRect().width);
    }
  });

  const options = Children.map(children, (child) => (
    <MenuItem>{cloneElement(child, { onChange })}</MenuItem>
  ));

  let blurTimeoutId;
  const onBlurHandler = () => {
    blurTimeoutId = setTimeout(() => setOpen(false));
  };
  const onFocusHandler = () => {
    clearTimeout(blurTimeoutId);
  };

  return (
    <DropdownContainer onBlur={onBlurHandler} onFocus={onFocusHandler}>
      <Trigger ref={triggerRef} onClick={() => setOpen(!isOpen)}>
        {renderTrigger()}
      </Trigger>
      {isOpen && <Menu triggerWidth={triggerWidth}>{options}</Menu>}
    </DropdownContainer>
  );
}
Dropdown.Option = DropdownOption;
Dropdown.propTypes = {};
Dropdown.defaultProps = {
  onChange: () => {}
};
