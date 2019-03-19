import { useState } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import moment from 'moment';
import Form from './Form';
import Input from './Input';

const CREATE_EVENT = gql`
  mutation CREATE_EVENT($data: EventInputData) {
    event: addEvent(data: $data) {
      id
      title
      date
      type
    }
  }
`;
const UPDATE_EVENT = gql`
  mutation UPDATE_EVENT($id: ID!, $data: EventInputData) {
    event: updateEvent(id: $id, data: $data) {
      id
      title
      date
      type
    }
  }
`;

const DEFAULT_FORM_FIELDS = {
  title: '',
  date: moment().toISOString(),
  type: '',
  involvedContacts: [],
  note: ''
};

export default function EventForm({
  event: { id, __typename, ...event },
  onSubmit
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_FIELDS,
    ...event,
    involvedContacts: event.involvedContacts.map(({ id }) => id)
  });
  const mutateEvent = useMutation(id ? UPDATE_EVENT : CREATE_EVENT, {
    variables: { id, data: formData }
  });

  const onFormSubmit = async () => {
    setLoading(true);
    mutateEvent()
      .then(({ data }) => {
        setFormData(DEFAULT_FORM_FIELDS);
        onSubmit(data.event);
      })
      .catch((reason) => {
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
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={onChange}
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
      />
      {/* <div>
        Contacts:{' '}
        {event.involvedContacts.map(({ fullName }) => fullName).join(', ')}
      </div> */}
      <Input
        label="Note"
        name="note"
        type="textarea"
        value={formData.note}
        onChange={onChange}
      />
    </Form>
  );
}
EventForm.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    type: PropTypes.string,
    involvedContacts: PropTypes.array
  }),
  onSubmit: PropTypes.func
};
EventForm.defaultProps = {
  event: {},
  onSubmit: () => {}
};
