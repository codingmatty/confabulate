import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Icon from './Icon';

const TOGGLE_FAVORITE = gql`
  mutation TOGGLE_FAVORITE($id: ID!) {
    contact: toggleFavoriteState(id: $id) {
      favorite
    }
  }
`;

const FavoriteButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.primary[5]};
  font-size: 1.5rem;
`;

export default function FavoriteContact({ contactId, isFavorite, className }) {
  const [favorite, setFavorite] = useState(isFavorite);
  const toggleFavorite = useMutation(TOGGLE_FAVORITE, {
    variables: {
      id: contactId
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
  isFavorite: PropTypes.bool,
  className: PropTypes.string
};
