import styled from 'styled-components';

export default styled.div`
  color: ${({ theme }) => theme.color.neutrals[5]};
  font-size: ${({ small }) => (small ? `0.75rem` : `1rem`)};
  margin: 0 0 1em;
  text-transform: uppercase;
`;
