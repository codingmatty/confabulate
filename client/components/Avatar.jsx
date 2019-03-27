import md5 from 'md5-o-matic';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: 50%;
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem;
  border: 1px solid ${({ theme }) => theme.color.neutrals[8]};
`;

export default function Avatar({ className, email = '', image, size = 3 }) {
  if (image) {
    return <StyledAvatar src={image} size={size} className={className} />;
  }

  const hash = md5(email);
  const gravatarUrl = `https://s.gravatar.com/avatar/${hash}?s=${size *
    16 *
    2}&d=mp`;

  return <StyledAvatar src={gravatarUrl} size={size} className={className} />;
}
Avatar.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string,
  image: PropTypes.string,
  size: PropTypes.number
};
