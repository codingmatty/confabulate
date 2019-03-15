import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledIcon = styled.i`
  font-size: ${({ size }) => size};
  font-weight: ${({ bold }) => bold && 'bold'};
`;

export default function Icon({ type, bold, size }) {
  return (
    <StyledIcon className="material-icons" size={size} bold={bold}>
      {type}
    </StyledIcon>
  );
}
Icon.propTypes = {
  type: PropTypes.string,
  bold: PropTypes.bool,
  size: PropTypes.string
};
