import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './common/Avatar';
import Icon from './common/Icon';
import Link from './common/Link';
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
  cursor: pointer;
`;
const ContactDetails = styled.ul`
  font-size: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;
const ContactDetail = styled.li`
  display: flex;
  align-items: center;
`;
const ContactIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

export default function ContactListItem({ contact }) {
  return (
    <li>
      <ItemContent
        asUrl={`/contacts/${contact.id}`}
        href={{ pathname: '/contacts/info', query: { id: contact.id } }}
      >
        <Avatar image={contact.image} email={contact.email} />
        <ContactInfo>
          <b>{contact.name}</b>
          <ContactDetails>
            {contact.email && (
              <ContactDetail>
                <ContactIcon type="mail" /> {contact.email}
              </ContactDetail>
            )}
            {contact.phoneNumber && (
              <ContactDetail>
                <ContactIcon type="phone" /> {contact.phoneNumber}
              </ContactDetail>
            )}
          </ContactDetails>
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
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  })
};
