import { useState } from 'react';
import styled from 'styled-components';
import ContactList from '../../components/ContactList';
import PageTitle from '../../components/common/PageTitle';
import Icon from '../../components/common/Icon';
import Link from '../../components/common/Link';
import SearchInput from '../../components/SearchInput';

const CreateContactLink = styled(Link)`
  background-color: white;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.color.greens[4]};
  bottom: 1.5rem;
  box-shadow: 3px 3px 15px -6px ${({ theme }) => theme.color.neutrals[7]};
  color: ${({ theme }) => theme.color.greens[4]};
  font-size: 2rem;
  line-height: 0;
  padding: 0.5rem;
  position: fixed;
  right: 1.5rem;
`;
const StyledContactsPage = styled.div`
  margin-bottom: 3rem;
`;

export default function Contacts() {
  const [searchInput, setSearchInput] = useState('');

  return (
    <StyledContactsPage>
      <PageTitle>Contacts</PageTitle>
      <SearchInput onChange={(searchValue) => setSearchInput(searchValue)} />
      <ContactList search={searchInput} />
      <CreateContactLink href="/contacts/create">
        <Icon type="add" />
      </CreateContactLink>
    </StyledContactsPage>
  );
}
