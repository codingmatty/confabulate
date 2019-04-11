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
        name
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
      </div>
    </div>
  );
}
