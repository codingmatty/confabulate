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

export default function ContactList({ search }) {
  const {
    data: { contacts },
    error,
    loading
  } = useQuery(QUERY_CONTACTS, { fetchPolicy: 'cache-and-network' });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <StyledContactList>
        {contacts
          .filter((contact) =>
            Object.values(contact)
              .join('')
              .toLowerCase()
              .includes(search)
          )

          .map((contact) => (
            <ContactListItem key={contact.id} contact={contact} />
          ))}
      </StyledContactList>
    </>
  );
}
