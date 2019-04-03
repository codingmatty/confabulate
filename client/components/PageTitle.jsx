import styled from 'styled-components';

const StyledPageTitle = styled.h1`
  color: ${({ theme }) => theme.color.neutrals[5]};
  font-size: 1rem;
  margin: 0 0 1rem;
  text-transform: uppercase;
`;

export default function PageTitle({ children }) {
  return <StyledPageTitle>{children}</StyledPageTitle>;
}
