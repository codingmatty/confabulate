import PropTypes from 'prop-types';
import { useState } from 'react';
import { Swipeable } from 'react-swipeable';
import styled from 'styled-components';
import Link from './Link';
import Avatar from './Avatar';

const OFFSET_SIZE = 80;
const MIN_LEFT = -OFFSET_SIZE;
const MAX_LEFT = 0;

const ItemHeight = '60px';
const ItemContent = styled(Link)`
  left: 0;
  padding: 1rem 2rem;
  position: absolute;
  transition: left 300ms;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledContact = styled(Swipeable)`
  height: calc(${ItemHeight} + 2rem);
  position: relative;
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
        asUrl={`/contacts/${contact.id}`}
        href={{ pathname: '/contacts/info', query: { id: contact.id } }}
        style={{ left }}
        innerRef={(itemContentRef) =>
          itemContentRef &&
          setHeight(window.getComputedStyle(itemContentRef).height)
        }
      >
        <Avatar email={contact.email || ''} />
        <div style={{ marginLeft: '1rem' }}>
          <b>
            {contact.firstName} {contact.lastName}
          </b>
          <br />
          <small>{contact.email}</small>
          <br />
          <small>{contact.phoneNumber}</small>
        </div>
      </ItemContent>
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
