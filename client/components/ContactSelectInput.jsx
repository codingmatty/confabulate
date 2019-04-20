import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Downshift from 'downshift';

const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS {
    contacts {
      id
      name
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  :not(:first-child) {
    margin-top: 1rem;
  }
`;
const LabelWrapper = styled.label``;
const Label = styled.span`
  display: block;
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;
const DropdownList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  position: absolute;
  top: 100%;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.neutrals[3]};
`;
const DropdownListItem = styled.li`
  padding: 0.5rem 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.color.neutrals[1]};
  }
`;
const SelectedContact = styled.span`
  font-size: 0.75rem;
  background-color: ${({ theme }) => theme.color.neutrals[1]};
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
`;
const InputControl = styled.input`
  border: none;
  margin: 0.25rem;
  outline: none;
`;
const InputControlWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.color.neutrals[3]};
  box-sizing: border-box;
  border-radius: 2px;
  width: 100%;
  padding: 0.25rem;
  font-size: 1rem;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;
const Border = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  content: '';

  ${InputControl}:focus ~ & {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;
const Error = styled.div``;

function stateReducer(previousState, nextState) {
  switch (nextState.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
      return {
        ...nextState,
        inputValue: '' // Clear input after selecting user
      };
    default:
      return nextState;
  }
}

export default function UserSelectInput({
  disabled,
  error,
  id,
  label,
  name,
  onChange,
  placeholder,
  // required,
  value
}) {
  const {
    data: { contacts },
    error: fetchError,
    loading
  } = useQuery(QUERY_CONTACTS);

  const selectedContacts = loading
    ? []
    : value.map((selectedContactId) =>
        contacts.find(({ id }) => id === selectedContactId)
      );

  const onSelectChange = (type) => (selection) => {
    onChange({
      target: {
        name,
        value:
          type === 'add'
            ? value.concat(selection.id)
            : value.filter((id) => id !== selection.id)
      }
    });
  };

  return (
    <Downshift
      onChange={onSelectChange('add')}
      itemToString={(item) => (item ? item.name : '')}
      selectedItem={null}
      stateReducer={stateReducer}
    >
      {({
        getRootProps,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex
      }) => (
        <InputWrapper {...getRootProps({ disabled })}>
          <LabelWrapper
            {...getLabelProps({
              for: id
            })}
          >
            <Label>{label}</Label>
            <InputControlWrapper>
              {selectedContacts.map(({ id, name }) => (
                <SelectedContact key={id}>
                  {name}
                  <button onClick={() => onSelectChange('remove')({ id })}>
                    X
                  </button>
                </SelectedContact>
              ))}
              <InputControl
                id={id}
                {...getInputProps({
                  disabled,
                  placeholder,
                  onKeyDown(event) {
                    if (event.key === 'Backspace' && !inputValue) {
                      onSelectChange('remove')(
                        selectedContacts[selectedContacts.length - 1]
                      );
                    }
                  }
                })}
              />
              <Border />
            </InputControlWrapper>
          </LabelWrapper>
          {isOpen ? (
            <DropdownList {...getMenuProps()}>
              {contacts
                .filter((contact) => !value.includes(contact.id))
                .filter(
                  (contact) => !inputValue || contact.name.includes(inputValue)
                )
                .map((contact, index) => (
                  <DropdownListItem
                    key={contact.id}
                    {...getItemProps({
                      key: contact.id,
                      index,
                      item: contact,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white'
                      }
                    })}
                  >
                    {contact.name}
                  </DropdownListItem>
                ))}
            </DropdownList>
          ) : null}
          {(error || fetchError) && <Error>{error || fetchError}</Error>}
        </InputWrapper>
      )}
    </Downshift>
  );
}

UserSelectInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.array
};
UserSelectInput.defaultProps = {};
