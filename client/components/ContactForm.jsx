import { useState } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import pick from 'lodash/pick';
import Form from './Form';
import Input from './Input';

const CREATE_CONTACT = gql`
  mutation CREATE_CONTACT($data: ContactInputData!) {
    contact: addContact(data: $data) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
const UPDATE_CONTACT = gql`
  mutation UPDATE_CONTACT($id: ID!, $data: ContactInputData!) {
    contact: updateContact(id: $id, data: $data) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

const DEFAULT_FORM_FIELDS = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
};

export default function ContactForm({ contact: { id, ...contact }, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    pick(
      {
        ...DEFAULT_FORM_FIELDS,
        ...contact
      },
      'firstName',
      'lastName',
      'email',
      'phoneNumber'
    )
  );
  const mutateContact = useMutation(id ? UPDATE_CONTACT : CREATE_CONTACT, {
    variables: { id, data: formData }
  });

  const onFormSubmit = async () => {
    setLoading(true);
    mutateContact()
      .then(({ data }) => {
        setFormData(DEFAULT_FORM_FIELDS);
        onSubmit(data.contact);
      })
      .catch((reason) => {
        console.error({ reason });
      });
  };

  const onChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Form onSubmit={onFormSubmit} loading={loading} submitLabel="Submit">
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
  );
}
ContactForm.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  onSubmit: PropTypes.func
};
ContactForm.defaultProps = {
  contact: {},
  onSubmit: () => {}
};
