import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import ContactForm from './ContactForm';

const QUERY_CONTACT = gql`
  query QUERY_CONTACT($id: ID!) {
    contact(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

export default function Contact({ id }) {
  const { data, loading, error } = useQuery(QUERY_CONTACT, {
    variables: { id }
  });
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  } else if (!contact) {
    setContact(data.contact);
  }

  return (
    <div>
      {editing ? (
        <ContactForm
          contact={contact}
          onSubmit={(updatedContact) => {
            setContact(updatedContact);
            setEditing(false);
          }}
        />
      ) : (
        <>
          <pre>{JSON.stringify(contact, null, 2)}</pre>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
}
Contact.propTypes = {
  id: PropTypes.string.isRequired
};
