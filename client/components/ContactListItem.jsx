import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from './Link';
import Avatar from './Avatar';
import FavoriteContact from './FavoriteContact';

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  flex-basis: 100%;
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
`;
const ItemContent = styled(Link)`
  padding: 1rem 0;
  display: grid;
  grid-template-columns: 0fr auto 0fr;
  grid-gap: 1.5rem;
  align-items: flex-start;
  justify-items: 
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
        <ContactInfo>
          <b>
            {contact.firstName} {contact.lastName}
          </b>
          <small>{contact.email}</small>
          <small>{contact.phoneNumber}</small>
        </ContactInfo>
        <Actions>
          <FavoriteContact
            contactId={contact.id}
            isFavorite={contact.favorite}
          />
        </Actions>
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
