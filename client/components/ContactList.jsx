import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import ContactListItem from './ContactListItem';
import Icon from './Icon';
import Link from './Link';

const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS {
    contacts {
      id
      firstName
      lastName
      email
      phoneNumber
      favorite
    }
  }
`;

const CreateContactLink = styled(Link)`
  background-color: white;
  border-radius: 50%;
  border: 2px solid teal;
  bottom: 1.5rem;
  box-shadow: 0 0 0 0 black;
  color: teal;
  line-height: 0;
  padding: 0.5rem;
  position: fixed;
  right: 1.5rem;
`;

const StyledContactList = styled.ul`
  margin: 0 0 4rem;
  padding: 0;
  list-style: none;
`;

export default function ContactList() {
  const {
    data: { contacts },
    error,
    loading
  } = useQuery(QUERY_CONTACTS);
  const [unswipeChild, setUnswipeChild] = useState();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <StyledContactList>
        {contacts.map((contact) => (
          <ContactListItem
            key={contact.id}
            contact={contact}
            onChildSwiped={(unswipeChildCallback) => {
              if (unswipeChild) {
                unswipeChild();
              }
              setUnswipeChild(() => unswipeChildCallback);
            }}
          />
        ))}
      </StyledContactList>
      <CreateContactLink href="/contacts/create">
        <Icon type="add" size="2rem" />
      </CreateContactLink>
    </>
  );
}
