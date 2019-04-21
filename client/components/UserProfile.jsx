import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import UtilityText from './common/UtilityText';
import Avatar from './Avatar';
import Loader from './Loader';
import GoogleContactsButton from './GoogleContactsButton';

const EmptyValue = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.color.neutrals[5]};
`;
const InfoSection = styled.div`
  margin: 1rem 0;
`;
const InfoLabel = styled.label`
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const QUERY_USER = gql`
  query QUERY_USER {
    user {
      id
      email
      profile {
        name
        image
      }
    }
  }
`;
const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE($data: ProfileUpdateData!) {
    event: updateProfile(data: $data) {
      id
      profile {
        name
      }
    }
  }
`;

export default function UserProfile() {
  const {
    data: { user },
    error,
    loading
  } = useQuery(QUERY_USER);
  const [editingName, setEditingName] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [nameInput, setNameInput] = useState(null);
  const updateUserName = useMutation(UPDATE_PROFILE, {
    variables: { data: { name: nameInput } },
    refetchQueries: [{ query: QUERY_USER }]
  });

  if (loading) {
    return <Loader size="5" />;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  } else if (!dataLoaded) {
    setDataLoaded(true);
    setNameInput(user.profile.name);
  }

  return (
    <div>
      <Avatar image={user.profile.image} email={user.email} size={8} />
      <InfoSection>
        <UtilityText small>Details</UtilityText>
        <InfoLabel>Email:</InfoLabel>
        <div>{user.email}</div>
        <InfoLabel>Full Name:</InfoLabel>
        {editingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserName().then(() => setEditingName(false));
            }}
          >
            <input
              name="name"
              value={nameInput}
              onChange={({ target }) => setNameInput(target.value)}
            />
            <button>Save</button>
          </form>
        ) : (
          <div>
            {user.profile.name || <EmptyValue>empty</EmptyValue>}
            <button onClick={() => setEditingName(true)}>Edit</button>
          </div>
        )}
      </InfoSection>
      <InfoSection>
        <UtilityText small>Connection</UtilityText>
        <GoogleContactsButton />
      </InfoSection>
    </div>
  );
}
