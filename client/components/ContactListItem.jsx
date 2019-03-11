import PropTypes from 'prop-types';
import { useState } from 'react';
import { Swipeable } from 'react-swipeable';
import styled from 'styled-components';
import Link from 'next/link';

const OFFSET_SIZE = 80;
const MIN_LEFT = -OFFSET_SIZE;
const MAX_LEFT = 0;

const Action = styled.a`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  margin-left: auto;
  width: ${OFFSET_SIZE}px;
`;

const ItemHeight = '60px';
const ItemContent = styled.div`
  left: 0;
  padding: 1rem;
  position: absolute;
  transition: left 300ms;
  width: 100%;
`;

const StyledContact = styled(Swipeable)`
  height: calc(${ItemHeight} + 2rem);
  position: relative;

  &:nth-child(even) ${ItemContent} {
    background-color: #e0e0e0;
  }
  &:nth-child(odd) ${ItemContent} {
    background-color: #f0f0f0;
  }
`;

export default function ContactListItem({ contact, onChildSwiped }) {
  const [left, setLeft] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <StyledContact
      nodeName="li"
      trackMouse
      onSwipedLeft={() => setLeft(Math.max(left - OFFSET_SIZE, MIN_LEFT))}
      onSwipedRight={() => setLeft(Math.min(left + OFFSET_SIZE, MAX_LEFT))}
      onSwiping={(e) => {
        if (e.dir === 'Left') {
          setLeft(Math.max(left - e.absX, MIN_LEFT));
        } else if (e.dir === 'Right') {
          setLeft(Math.min(left + e.absX, MAX_LEFT));
        }
      }}
      onSwiped={() => onChildSwiped(() => setLeft(0))}
      style={{ height }}
    >
      <ItemContent
        style={{ left }}
        ref={(itemContentRef) =>
          itemContentRef &&
          setHeight(window.getComputedStyle(itemContentRef).height)
        }
      >
        Name: {contact.firstName} {contact.lastName}
        <br />
        Email: {contact.email}
        <br />
        Phone Number: {contact.phoneNumber}
      </ItemContent>
      <Link
        as={`/contacts/${contact.id}`}
        href={{ pathname: '/contacts/info', query: { id: contact.id } }}
      >
        <Action
          right
          // onClick={(e) => {
          //   e.preventDefault();
          //   console.log('Edit Contact');
          // }}
        >
          Edit
        </Action>
      </Link>
    </StyledContact>
  );
}
ContactListItem.propTypes = {
  contact: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  onChildSwiped: PropTypes.func
};
