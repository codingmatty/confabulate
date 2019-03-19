import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Icon from './Icon';

const FAVORITE_CONTACT = gql`
  mutation FAVORITE_CONTACT($id: ID!, $data: ContactInputData) {
    contact: updateContact(id: $id, data: $data) {
      favorite
    }
  }
`;

const FavoriteButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: goldenrod;
  font-size: 1.5rem;
`;

export default function FavoriteContact({ contactId, isFavorite, className }) {
  const [favorite, setFavorite] = useState(isFavorite);
  const toggleFavorite = useMutation(FAVORITE_CONTACT, {
    variables: {
      id: contactId,
      data: {
        favorite: !favorite
      }
    }
  });

  return (
    <FavoriteButton
      className={className}
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite().then(({ data: { contact } }) =>
          setFavorite(contact.favorite)
        );
      }}
    >
      <Icon type={favorite ? 'star' : 'star_border'} />
    </FavoriteButton>
  );
}
FavoriteContact.propTypes = {
  contactId: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool
};
