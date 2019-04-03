import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo-hooks';
import styled from 'styled-components';
import Avatar from './Avatar';
import Loader from './Loader';

const EmptyValue = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.color.neutrals[5]};
`;

const QUERY_USER = gql`
  query QUERY_USER {
    user {
      id
      email
      profile {
        firstName
        lastName
        fullName
      }
    }
  }
`;
const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE($data: ProfileUpdateData!) {
    event: updateProfile(data: $data) {
      id
      profile {
        firstName
        lastName
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
  const [firstNameInput, setFirstNameInput] = useState(null);
  const [lastNameInput, setLastNameInput] = useState(null);
  const updateUserName = useMutation(UPDATE_PROFILE, {
    variables: { data: { firstName: firstNameInput, lastName: lastNameInput } },
    refetchQueries: [{ query: QUERY_USER }]
  });

  if (loading) {
    return <Loader size="5" />;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  } else if (!dataLoaded) {
    setDataLoaded(true);
    setFirstNameInput(user.profile.firstName);
    setLastNameInput(user.profile.lastName);
  }

  return (
    <div>
      <Avatar email={user.email} size={8} />
      <div>
        <label>Full Name:</label>
        {editingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserName().then(() => setEditingName(false));
            }}
          >
            <input
              name="firstName"
              value={firstNameInput}
              onChange={({ target }) => setFirstNameInput(target.value)}
            />
            <input
              name="lastName"
              value={lastNameInput}
              onChange={({ target }) => setLastNameInput(target.value)}
            />
            <button>Save</button>
          </form>
        ) : (
          <div>
            {user.profile.fullName || <EmptyValue>empty</EmptyValue>}
            <button onClick={() => setEditingName(true)}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}
