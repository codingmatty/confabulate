import md5 from 'md5-o-matic';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: 50%;
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem;
  border: 1px solid ${({ theme }) => theme.color.neutrals[8]};
`;

function getSource({ email, image, size }) {
  if (image) {
    return image;
  }

  const hash = md5(email || '');
  return `https://s.gravatar.com/avatar/${hash}?s=${size * 16 * 2}&d=mp`;
}

export default function Avatar({ className, email, image, size = 3 }) {
  return (
    <StyledAvatar
      src={getSource({ email, image, size })}
      size={size}
      className={className}
    />
  );
}
Avatar.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string,
  image: PropTypes.string,
  size: PropTypes.number
};
