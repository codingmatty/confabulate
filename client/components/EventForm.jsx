import styled from 'styled-components';
import { useState } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import moment from 'moment';
import Form from './Form';
import Input from './Input';
import ContactSelectInput from './ContactSelectInput';

const CREATE_EVENT = gql`
  mutation CREATE_EVENT($data: EventInputData!) {
    event: addEvent(data: $data) {
      id
      date
      type
      note
    }
  }
`;
const UPDATE_EVENT = gql`
  mutation UPDATE_EVENT($id: ID!, $data: EventUpdateData!) {
    event: updateEvent(id: $id, data: $data) {
      id
      date
      type
      note
    }
  }
`;

const DEFAULT_FORM_FIELDS = {
  date: moment().toISOString(),
  involvedContacts: [],
  note: '',
  type: ''
};

const NotesInput = styled(Input)`
  flex-grow: 1;
`;

export default function EventForm({
  // eslint-disable-next-line no-unused-vars
  event: { id, __typename, ...event },
  onSubmit,
  refetchQuery
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_FIELDS,
    ...event,
    involvedContacts: event.involvedContacts.map(({ id }) => id)
  });
  const mutateEvent = useMutation(id ? UPDATE_EVENT : CREATE_EVENT, {
    refetchQueries: [refetchQuery],
    variables: { data: formData, id }
  });

  const onFormSubmit = () => {
    setLoading(true);
    mutateEvent()
      .then(({ data }) => {
        setFormData(DEFAULT_FORM_FIELDS);
        onSubmit(data.event);
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.error({ reason });
      });
  };

  const onChange = ({ target: { value, name } }) => {
    if (name === 'date') {
      value = moment(value).toISOString();
    }
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Form onSubmit={onFormSubmit} loading={loading} submitLabel="Submit">
      <ContactSelectInput
        label="Contacts"
        name="involvedContacts"
        value={formData.involvedContacts}
        onChange={onChange}
        placeholder="Who was involved"
        required
      />
      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={onChange}
      />
      <Input
        label="Type"
        name="type"
        value={formData.type}
        onChange={onChange}
        placeholder="What type of event was this?"
      />
      <NotesInput
        label="Notes"
        name="note"
        type="textarea"
        value={formData.note}
        onChange={onChange}
        placeholder="What all did you talk about at this event?"
      />
    </Form>
  );
}
EventForm.propTypes = {
  event: PropTypes.shape({
    date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    id: PropTypes.string,
    involvedContacts: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string })
    ),
    type: PropTypes.string
  }),
  onSubmit: PropTypes.func,
  refetchQuery: PropTypes.shape({
    query: PropTypes.object.isRequired,
    variables: PropTypes.object
  })
};
EventForm.defaultProps = {
  event: {},
  onSubmit: () => {}
};
