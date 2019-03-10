import styled from 'styled-components';
import ContactForm from '../../components/ContactForm';

const StyledCreateContactPage = styled.div`
  padding: 1rem;
`;

export default function CreateContact() {
  return (
    <StyledCreateContactPage>
      <h1>Create Contact</h1>
      <ContactForm />
    </StyledCreateContactPage>
  );
}
