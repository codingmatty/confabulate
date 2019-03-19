import styled from 'styled-components';
import Contact from '../../components/Contact';
import Icon from '../../components/Icon';
import Link from '../../components/Link';

const StyledLink = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;
const BackIcon = styled(Icon)`
  font-size: 1.5rem;
`;

export default function ContactInfo({ id }) {
  return (
    <>
      <StyledLink href="/contacts">
        <BackIcon type="arrow_back" />
        <small>Contacts</small>
      </StyledLink>
      <Contact id={id} />
    </>
  );
}
ContactInfo.getInitialProps = ({ query: { id } }) => ({ id });
