import { useState } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import pick from 'lodash/pick';
import Form from './Form';
import Input from './Input';
import BirthdayInput from './BirthdayInput';

const ContactFields = gql`
  fragment ContactFields on Contact {
    id
    name
    email
    phoneNumber
  }
`;
const QUERY_CONTACTS = gql`
  query QUERY_CONTACTS($query: ContactQueryData) {
    contacts(query: $query) {
      ...ContactFields
    }
  }
  ${ContactFields}
`;
const CREATE_CONTACT = gql`
  mutation CREATE_CONTACT($data: ContactInputData!) {
    contact: addContact(data: $data) {
      ...ContactFields
    }
  }
  ${ContactFields}
`;
const UPDATE_CONTACT = gql`
  mutation UPDATE_CONTACT($id: ID!, $data: ContactInputData!) {
    contact: updateContact(id: $id, data: $data) {
      ...ContactFields
    }
  }
  ${ContactFields}
`;

const DEFAULT_FORM_FIELDS = {
  name: '',
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
      'name',
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
      refetchQueries: [refetchQuery].filter((x) => x),
      variables: { data: formData, id }
    }
  );

  const onFormSubmit = () => {
    setLoading(true);
    mutateContact()
      .then(({ data }) => {
        onSubmit(data.contact);
        setFormData(DEFAULT_FORM_FIELDS);
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
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
        label="Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Contact Name"
        required
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
        placeholder="Contact Email"
      />
      <Input
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={onChange}
        placeholder="Contact Phone Number"
      />
    </Form>
  );
}
ContactForm.propTypes = {
  contact: PropTypes.shape({
    birthday: PropTypes.shape({
      day: PropTypes.number,
      month: PropTypes.number,
      year: PropTypes.number
    }),
    email: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  onSubmit: PropTypes.func,
  refetchQuery: PropTypes.shape({
    query: PropTypes.object.isRequired,
    variables: PropTypes.object
  })
};
ContactForm.defaultProps = {
  contact: {},
  onSubmit: () => {},
  refetchQuery: { query: QUERY_CONTACTS }
};
