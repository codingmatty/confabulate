import styled from 'styled-components';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import Dialog from './common/Dialog';
import Icon from './Icon';

const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS {
    contacts {
      id
    }
  }
`;
const DELETE_CONTACT = gql`
  mutation DELETE_CONTACT($id: ID!) {
    status: removeContact(id: $id) {
      status
      message
    }
  }
`;

const DeleteButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.reds[3]};
  font-size: 1.5rem;
`;

export default function DeleteContact({ contactId, className, onDelete }) {
  const deleteContact = useMutation(DELETE_CONTACT, {
    variables: {
      id: contactId
    },
    refetchQueries: [
      {
        query: QUERY_CONTACTS // Refetch the contacts to remove this contact
      }
    ]
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <DeleteButton
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setShowConfirmation(true);
        }}
      >
        <Icon type="delete_outline" />
      </DeleteButton>
      <Dialog
        message="Are you sure you want to delete this contact?"
        isOpen={showConfirmation}
        type="option"
        labels={{
          no: { text: 'Cancel', type: 'transparent' },
          yes: { text: 'Delete', type: 'destructive' }
        }}
        onConfirm={() => {
          deleteContact().then(({ data: { status } }) => {
            setShowConfirmation(false);
            onDelete(status);
          });
        }}
        onDeny={() => {
          setShowConfirmation(false);
        }}
      />
    </>
  );
}
DeleteContact.propTypes = {
  className: PropTypes.string,
  contactId: PropTypes.string.isRequired,
  onDelete: PropTypes.func
};
DeleteContact.defaultProps = {
  onDelete: () => {}
};
