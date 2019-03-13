import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from './Link';
import Avatar from './Avatar';

const ItemContent = styled(Link)`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default function ContactListItem({ contact }) {
  return (
    <li>
      <ItemContent
        asUrl={`/contacts/${contact.id}`}
        href={{ pathname: '/contacts/info', query: { id: contact.id } }}
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
    </li>
  );
}
ContactListItem.propTypes = {
  contact: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  })
};
