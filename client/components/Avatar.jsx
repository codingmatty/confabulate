import md5 from 'md5-o-matic';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
`;

export default function Avatar({ email }) {
  const hash = md5(email);
  const gravatarUrl = `https://s.gravatar.com/avatar/${hash}?s=80&d=mp`;

  return <StyledAvatar src={gravatarUrl} />;
}
Avatar.propTypes = {
  email: PropTypes.string.isRequired
};
