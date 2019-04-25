import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import merge from 'lodash/merge';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import * as yup from 'yup';
import omitTypename from '../utils/omitTypename';
// import BirthdayInput from './common/BirthdayInput';
import Form from './common/Form';
import Input from './common/Input';

const ContactFields = gql`
  fragment ContactFields on Contact {
    id
    name
    notes {
      label
      value
    }
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

const schema = yup.object().shape({
  name: yup.string().required('Please provide a name'),
  notes: yup.array().of(
    yup.object().shape({
      label: yup.string().required(),
      value: yup.string()
    })
  )
});

export default function ContactForm({
  contact: { id, ...contact },
  onSubmit,
  refetchQuery
}) {
  const isExistingContact = Boolean(id);
  const mutateContact = useMutation(
    isExistingContact ? UPDATE_CONTACT : CREATE_CONTACT,
    {
      refetchQueries: [refetchQuery].filter((x) => x)
    }
  );

  const onCancel = () => {
    onSubmit({ id, ...contact });
  };

  return (
    <Formik
      initialValues={merge(
        {
          name: '',
          notes: [
            {
              label: 'How did you meet?',
              value: ''
            }
          ]
        },
        contact
      )}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        const data = omitTypename(values);
        mutateContact({ variables: { data, id } })
          .then(({ data }) => {
            onSubmit(data.contact);
          })
          .catch((reason) => {
            // eslint-disable-next-line no-console
            console.error({ reason });
          });

        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <Form
          onSubmit={handleSubmit}
          disabled={isSubmitting}
          submitLabel={isExistingContact ? 'Save' : 'Submit'}
          onCancel={isExistingContact && onCancel}
        >
          <Input
            label="Name"
            name="name"
            value={values.name}
            error={touched.name && errors.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Contact Name"
            required
          />
          <Input
            label={values.notes[0].label}
            name="notes[0].value"
            type="textarea"
            rows="4"
            value={values.notes[0].value}
            error={touched.notes && errors.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe how you know this contact"
          />
        </Form>
      )}
    </Formik>
  );
}
ContactForm.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    )
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
