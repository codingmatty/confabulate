import styled from 'styled-components';
import ContactList from '../../components/ContactList';

const StyledContactsPage = styled.div`
  padding: 1rem;
`;

export default function Contacts() {
  return (
    <StyledContactsPage>
      <h1>Contact</h1>
      <ContactList />
    </StyledContactsPage>
  );
}
