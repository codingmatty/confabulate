import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo-hooks';
import Modal from 'react-modal';
import styled from 'styled-components';
import Button from './common/Button';
import Avatar from './Avatar';
import Loader from './Loader';
import SearchInput from './SearchInput';

const QUERY_GOOGLE_CONTACTS = gql`
  query QUERY_GOOGLE_CONTACTS {
    googleContacts {
      id
      name
      image
    }
  }
`;
const IMPORT_GOOGLE_CONTACTS = gql`
  mutation IMPORT_GOOGLE_CONTACTS($selectedIds: [String!]!) {
    importGoogleContacts(selectedIds: $selectedIds) {
      status
      message
    }
  }
`;
const GoogleContactList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const GoogleContactListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
`;

const StyledAvatar = styled(Avatar)`
  margin: 0 1rem;
`;

function GoogleContactsList({ onClose }) {
  const {
    data: { googleContacts },
    error,
    loading
  } = useQuery(QUERY_GOOGLE_CONTACTS, {
    // fetchPolicy: 'no-cache' // not working...
    fetchPolicy: 'network-only'
  });
  const [selectedContactsMap, setSelectedContactsMap] = useState({});
  const importContacts = useMutation(IMPORT_GOOGLE_CONTACTS, {
    variables: {
      selectedIds: Object.keys(selectedContactsMap).filter(
        (selectedContactId) => selectedContactsMap[selectedContactId]
      )
    }
  });
  const [search, setSearch] = useState('');

  if (loading) {
    return <Loader size="5" />;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <SearchInput onChange={(newSearch) => setSearch(newSearch)} />
      <Button
        fullWidth
        onClick={() =>
          importContacts().then(({ data: { importGoogleContacts } }) => {
            if (importGoogleContacts.status === 'IGNORED') {
              // eslint-disable-next-line no-console
              console.error(importGoogleContacts.message);
            } else {
              // eslint-disable-next-line no-console
              console.log(importGoogleContacts.message);
            }
            onClose();
          })
        }
      >
        Import
      </Button>
      <GoogleContactList>
        {googleContacts
          .filter(({ name }) => name.toLowerCase().includes(search))
          .map(({ id, name, image }) => (
            <GoogleContactListItem
              key={id}
              onClick={() => {
                setSelectedContactsMap({
                  ...selectedContactsMap,
                  [id]: !selectedContactsMap[id]
                });
              }}
            >
              <input
                type="checkbox"
                checked={selectedContactsMap[id] || false}
                onChange={({ target }) => {
                  setSelectedContactsMap({
                    ...selectedContactsMap,
                    [id]: target.checked
                  });
                }}
              />
              <StyledAvatar image={image} size={1.5} />
              <span>{name}</span>
            </GoogleContactListItem>
          ))}
      </GoogleContactList>
    </>
  );
}
GoogleContactsList.propTypes = {
  onClose: PropTypes.func
};

function openAuthWindow() {
  return window.open(
    `${window.location.origin}/api/google-contacts-auth`,
    'Authenticate',
    `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=800,height=800`
  );
}

export default function GoogleContactsButton() {
  const [loadingGoogleContacts, setLoadingGoogleContacts] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const onButtonClick = () => {
    setLoadingGoogleContacts(true);
    const popup = openAuthWindow();
    const closePopupInterval = setInterval(() => {
      try {
        if (popup && popup.closed) {
          clearInterval(closePopupInterval);
          setLoadingGoogleContacts(false);
          return;
        } else if (popup.location.origin === window.location.origin) {
          popup.close();
          setShowContacts(true);
        }
      } catch {
        // Checking popup.location will throw while the url has a different origin
      }
    }, 200);
  };

  return (
    <>
      <Button onClick={onButtonClick} disabled={loadingGoogleContacts}>
        Import Google Contacts
      </Button>
      <Modal
        style={{ overlay: { zIndex: 10000 } }}
        isOpen={showContacts}
        onRequestClose={() => setShowContacts(false)}
      >
        <div>Select which contacts to import:</div>
        {showContacts && (
          <GoogleContactsList onClose={() => setShowContacts(false)} />
        )}
      </Modal>
    </>
  );
}
