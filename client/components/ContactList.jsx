import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import ContactListItem from './ContactListItem';

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

const StyledContactList = styled.ul`
  margin: 0;
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
  );
}
