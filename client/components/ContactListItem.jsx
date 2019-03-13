import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Link from './Link';
import Avatar from './Avatar';

const FAVORITE_CONTACT = gql`
  mutation FAVORITE_CONTACT($id: ID!, $data: ContactInputData) {
    contact: updateContact(id: $id, data: $data) {
      favorite
    }
  }
`;

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
  const [favorite, setFavorite] = useState(contact.favorite);
  const toggleFavorite = useMutation(FAVORITE_CONTACT, {
    variables: {
      id: contact.id,
      data: {
        favorite: !favorite
      }
    }
  });

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
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite().then(({ data: { contact } }) =>
                setFavorite(contact.favorite)
              );
            }}
          >
            {favorite ? 'unFav' : 'Fav'}
          </button>
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
