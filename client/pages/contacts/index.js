import styled from 'styled-components';
import ContactList from '../../components/ContactList';
import Icon from '../../components/Icon';
import Link from '../../components/Link';

const CreateContactLink = styled(Link)`
  background-color: white;
  border-radius: 50%;
  border: 2px solid teal;
  bottom: 1.5rem;
  box-shadow: 0 0 0 0 black;
  color: teal;
  line-height: 0;
  padding: 0.5rem;
  position: fixed;
  right: 1.5rem;
`;
const StyledContactsPage = styled.div`
  margin-bottom: 3rem;
`;

export default function Contacts() {
  return (
    <StyledContactsPage>
      <h1>Contacts</h1>
      <ContactList />
      <CreateContactLink href="/contacts/create">
        <Icon type="add" size="2rem" />
      </CreateContactLink>
    </StyledContactsPage>
  );
}
