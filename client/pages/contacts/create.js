import Router from 'next/router';
import PageTitle from '../../components/common/PageTitle';
import ContactForm from '../../components/ContactForm';

export default function CreateContact() {
  return (
    <>
      <PageTitle>Create Contact</PageTitle>
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
