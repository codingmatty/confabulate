import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Form from './Form';
import Input from './Input';

const CREATE_CONTACT = gql`
  mutation CREATE_CONTACT($data: ContactInputData) {
    addContact(data: $data) {
      id
      firstName
    }
  }
`;

const DEFAULT_FORM_FIELDS = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_FIELDS);
  const createContact = useMutation(CREATE_CONTACT, {
    variables: { data: formData }
  });

  const onSubmit = async () => {
    setLoading(true);
    createContact()
      .then((result) => {
        console.log({ result });
        setFormData(DEFAULT_FORM_FIELDS);
      })
      .catch((reason) => {
        console.log({ reason });
      });
  };

  const onChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <h1>Create Contact</h1>
      <Form onSubmit={onSubmit} loading={loading} submitLabel="Submit">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
        />
        <Input
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onChange}
        />
      </Form>
    </>
  );
}
