import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import ContactListItem from './ContactListItem';
import Loader from './Loader';

const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS {
    contacts {
      id
      name
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
  } = useQuery(QUERY_CONTACTS);

  if (loading) {
    return <Loader size="5" />;
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
