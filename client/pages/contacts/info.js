import styled from 'styled-components';
import Contact from '../../components/Contact';

const StyledContactPage = styled.div`
  padding: 1rem;
`;

export default function ContactInfo({ id }) {
  return (
    <StyledContactPage>
      <h1>Contact</h1>
      <Contact id={id} />
    </StyledContactPage>
  );
}
ContactInfo.getInitialProps = ({ query: { id } }) => ({ id });
