import Router from 'next/router';
import ContactForm from '../../components/ContactForm';

export default function CreateContact() {
  return (
    <>
      <h1>Create Contact</h1>
      <ContactForm
        onSubmit={({ id }) =>
          Router.push(
            {
              pathname: '/contacts/info',
              query: { id }
            },
            `/contacts/${id}`
          )
        }
      />
    </>
  );
}
