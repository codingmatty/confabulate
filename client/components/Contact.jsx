import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import ContactForm from './ContactForm';
import Avatar from './Avatar';
import FavoriteContact from './FavoriteContact';
import Icon from './Icon';

const QUERY_CONTACT = gql`
  query QUERY_CONTACT($id: ID!) {
    contact(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      favorite
    }
  }
`;

const ContactCard = styled.div`
  position: relative;
  padding: calc(60px + 1rem) 1rem 1rem 1rem;
  margin-top: 60px;
  border: 1px solid #888;
  border-radius: 4px;
  box-shadow: 2px 2px 4px -2px #333;
`;
const StyledContactAvatar = styled(Avatar)`
  position: absolute;
  margin: 0 auto;
  top: -60px;
  display: block;
  left: 0;
  right: 0;
  box-shadow: 0 0 6px 1px #333;
`;
const ContactName = styled.h1`
  margin-top: 0;
  text-align: center;
`;
const StyledFavoriteContact = styled(FavoriteContact)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;
const EditButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
`;

export default function Contact({ id }) {
  const { data, loading, error } = useQuery(QUERY_CONTACT, {
    variables: { id }
  });
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState(null);

  if (!loading && !contact) {
    // sync the contact to state once it's queried
    setContact(data.contact);
  }
  if (loading || !contact) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      {editing ? (
        <>
          <h1>Editing Contact</h1>
          <ContactForm
            contact={contact}
            onSubmit={(updatedContact) => {
              setContact(updatedContact);
              setEditing(false);
            }}
          />
        </>
      ) : (
        <ContactCard>
          <EditButton onClick={() => setEditing(true)}>
            <Icon type="edit" />
          </EditButton>
          <StyledFavoriteContact
            contactId={contact.id}
            isFavorite={contact.favorite}
          />
          <StyledContactAvatar email={contact.email} size="120" />
          <ContactName>
            {contact.firstName} {contact.lastName}
          </ContactName>
          <div>
            <small>{contact.email}</small>
            <small>{contact.phoneNumber}</small>
          </div>
        </ContactCard>
      )}
    </>
  );
}
Contact.propTypes = {
  id: PropTypes.string.isRequired
};
