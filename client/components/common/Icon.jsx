import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledIcon = styled.i`
  font-size: inherit;
  font-weight: ${({ bold }) => bold && 'bold'};
`;

export default function Icon({ type, bold, className = '' }) {
  return (
    <StyledIcon className={`material-icons ${className}`} bold={bold}>
      {type}
    </StyledIcon>
  );
}
Icon.propTypes = {
  bold: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string
};
