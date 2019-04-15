import styled from 'styled-components';

export default styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.color.neutrals[5]};
  border-radius: 2px;
  font-size: 1rem;
  padding: 0.5rem 2rem;

  ${({ fullWidth }) => fullWidth && `width: 100%`};
`;
