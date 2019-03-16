import md5 from 'md5-o-matic';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: 50%;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
`;

export default function Avatar({ className, email, size = 50 }) {
  const hash = md5(email);
  const gravatarUrl = `https://s.gravatar.com/avatar/${hash}?s=${size *
    2}&d=mp`;

  return <StyledAvatar src={gravatarUrl} size={size} className={className} />;
}
Avatar.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string.isRequired,
  size: PropTypes.number
};
