import styled from 'styled-components';

const StyledSearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.neutrals[5]};
  border-radius: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

function SearchInput({ onChange }) {
  return (
    <StyledSearchInput
      placeholder="Search"
      onChange={({ target }) => onChange(target.value.toLowerCase())}
    />
  );
}

export default SearchInput;
