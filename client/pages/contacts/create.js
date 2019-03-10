import styled from 'styled-components';
import ContactForm from '../../components/ContactForm';

const CreateContactPage = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: fixed; // temp
`;

export default function CreateContact() {
  return (
    <CreateContactPage>
      <ContactForm />
    </CreateContactPage>
  );
}
