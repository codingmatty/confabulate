import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { convertBirthdayToString } from '../utils/dates';
import ContactForm from './ContactForm';
import Avatar from './Avatar';
import FavoriteContact from './FavoriteContact';
import Icon from './Icon';
import PageTitle from './PageTitle';
import ContactEventList from './ContactEventList';
import Loader from './Loader';

const QUERY_CONTACT = gql`
  query QUERY_CONTACT($id: ID!) {
    contact(id: $id) {
      id
      name
      image
      birthday {
        day
        month
        year
      }
      email
      phoneNumber
      favorite
    }
  }
`;
const contactAvatarSize = 7.5;
const contactAvatarHalfSize = contactAvatarSize / 2;

const ContactCard = styled.div`
  position: relative;
  padding: calc(${contactAvatarHalfSize}rem + 1rem) 1rem 1rem 1rem;
  margin-top: ${contactAvatarHalfSize + 1}rem;
  border: 1px solid #888;
  border-radius: 4px;
  box-shadow: 2px 2px 4px -2px #333;
  background-color: white;
  z-index: 1;
`;
const StyledContactAvatar = styled(Avatar)`
  position: absolute;
  margin: 0 auto;
  top: -${contactAvatarHalfSize}rem;
  display: block;
  left: 0;
  right: 0;
  box-shadow: 0 0 6px 1px #333;
`;
const ContactDetails = styled.ul`
  list-style: none;
  padding: 0;
  width: fit-content;
  margin: 1rem auto;
`;
const ContactDetail = styled.li`
  line-height: 1.5;
  display: flex;
  align-items: center;
`;
const ContactIcon = styled(Icon)`
  margin-right: 0.5rem;
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
  font-size: 1.5rem;
`;

export default function Contact({ id }) {
  const {
    data: { contact },
    loading,
    error
  } = useQuery(QUERY_CONTACT, {
    variables: { id }
  });
  const [editing, setEditing] = useState(false);

  if (loading) {
    return <Loader size="5" />;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  }

  if (editing) {
    return (
      <>
        <PageTitle>Editing Contact</PageTitle>
        <ContactForm
          contact={contact}
          refetchQuery={{ query: QUERY_CONTACT, variables: { id } }}
          onSubmit={() => setEditing(false)}
        />
      </>
    );
  }

  const birthdayString = convertBirthdayToString(contact.birthday);

  return (
    <>
      <ContactCard>
        <EditButton onClick={() => setEditing(true)}>
          <Icon type="edit" />
        </EditButton>
        <StyledFavoriteContact
          contactId={contact.id}
          isFavorite={contact.favorite}
        />
        <StyledContactAvatar
          image={contact.image}
          email={contact.email}
          size={contactAvatarSize}
        />
        <ContactName>{contact.name}</ContactName>
        <ContactDetails>
          {birthdayString && (
            <ContactDetail>
              <ContactIcon type="cake" /> {birthdayString}
            </ContactDetail>
          )}
          <ContactDetail>
            <ContactIcon type="mail" /> {contact.email}
          </ContactDetail>
          <ContactDetail>
            <ContactIcon type="phone" />{' '}
            {contact.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
          </ContactDetail>
        </ContactDetails>
      </ContactCard>
      <ContactEventList contact={contact} />
    </>
  );
}
Contact.propTypes = {
  id: PropTypes.string.isRequired
};
