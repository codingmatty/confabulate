import styled from 'styled-components';
import ContactList from '../../components/ContactList';

const StyledContactsPageTitle = styled.h1`
  padding: 1rem 1rem 0 1rem;
`;

export default function Contacts() {
  return (
    <>
      <StyledContactsPageTitle>Contact</StyledContactsPageTitle>
      <ContactList />
    </>
  );
}
