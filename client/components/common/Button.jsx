import styled from 'styled-components';

function colorByType({ theme, type }) {
  switch (type) {
    case 'primary':
      return `
      background-color: ${theme.color.blues[2]};
      border: 1px solid ${theme.color.blues[7]};
      `;
    case 'destructive':
      return `
      background-color: ${theme.color.reds[4]};
      border: 1px solid ${theme.color.reds[7]};
      color: white;
      `;
    case 'transparent':
      return `
      background-color: transparent;
      border: 1px solid transparent;
      `;
    case 'neutral':
      return `
      background-color: ${theme.color.neutrals[1]};
      border: 1px solid ${theme.color.neutrals[7]};
      `;
    default:
      return `
      background: none;
      border: 1px solid ${theme.color.neutrals[5]};
    `;
  }
}

export default styled.button`
  ${colorByType};
  border-radius: 2px;
  font-size: 1rem;
  padding: 0.5rem 2rem;

  ${({ fullWidth }) => fullWidth && `width: 100%`};
`;
