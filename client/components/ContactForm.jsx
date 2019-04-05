import { useState } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import pick from 'lodash/pick';
import Form from './Form';
import Input from './Input';
import BirthdayInput from './BirthdayInput';

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
  birthday: {
    day: null,
    month: null,
    year: null
  },
  email: '',
  phoneNumber: ''
};

export default function ContactForm({
  contact: { id, ...contact },
  onSubmit,
  refetchQuery
}) {
  const isExistingContact = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    pick(
      {
        ...DEFAULT_FORM_FIELDS,
        ...contact
      },
      'firstName',
      'lastName',
      'birthday.day',
      'birthday.month',
      'birthday.year',
      'email',
      'phoneNumber'
    )
  );
  const mutateContact = useMutation(
    isExistingContact ? UPDATE_CONTACT : CREATE_CONTACT,
    {
      variables: { id, data: formData },
      refetchQueries: [refetchQuery].filter((x) => x)
    }
  );

  const onFormSubmit = async () => {
    setLoading(true);
    mutateContact()
      .then(({ data }) => {
        onSubmit(data.contact);
        setFormData(DEFAULT_FORM_FIELDS);
      })
      .catch((reason) => {
        console.error({ reason });
      });
  };

  const onChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };
  const onCancel = () => {
    onSubmit({ id, ...contact });
  };

  return (
    <Form
      onSubmit={onFormSubmit}
      disabled={loading}
      submitLabel={isExistingContact ? 'Save' : 'Submit'}
      onCancel={isExistingContact && onCancel}
    >
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
      <BirthdayInput
        label="Birthday"
        name="birthday"
        value={formData.birthday}
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
    birthday: PropTypes.shape({
      day: PropTypes.number,
      month: PropTypes.number,
      year: PropTypes.number
    }),
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  onSubmit: PropTypes.func
};
ContactForm.defaultProps = {
  contact: {},
  onSubmit: () => {}
};
