import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Modal from 'react-modal';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import EventForm from './EventForm';
import Icon from './Icon';
import Loader from './Loader';

const QUERY_CONTACT_EVENTS = gql`
  query QUERY_CONTACT_EVENTS($query: EventQueryData) {
    events(query: $query) {
      id
      date
      type
      note
      involvedContacts {
        id
      }
    }
  }
`;

const EventTitle = styled.div``;
const EventHeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
`;
const EditButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  padding: 0;
`;
const EventDate = styled.span`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
`;
const EventNote = styled.p`
  margin: 0.5rem 0 0;
`;
const EventCard = styled.li`
  padding: 1rem;
  position: relative;
  border-radius: 4px;
  margin-left: 1.5rem;
  margin-right: 0.5rem;
  box-shadow: ${({ isNew, theme }) =>
    isNew
      ? `2px 2px 4px -2px ${theme.color.neutrals[5]}, 0 0 4px 2px ${
          theme.color.greens[5]
        }`
      : ``};
  &::before {
    content: '';
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.neutrals[7]};
    position: absolute;
    height: 8px;
    width: 8px;
    top: 22px;
    right: calc(100% + 6px);
  }
`;
const CreateEventButton = styled.button`
  background: none;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.25rem 2.5rem;
  text-transform: uppercase;
`;
const CreateEventContainer = styled.li`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;
const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  &::before {
    ${({ showBorder }) => showBorder && `content: ''`};
    border: 1px solid ${({ theme }) => theme.color.blues[2]};
    position: absolute;
    height: calc(100% + 1rem);
    left: 13px;
    top: -0.5rem;
  }
  &::after {
    ${({ showBorder }) => showBorder && `content: ''`};
    border: 1px solid ${({ theme }) => theme.color.blues[2]};
    position: absolute;
    left: 7px;
    width: 13px;
    bottom: -0.5rem;
  }
`;

export default function ContactEventList({ contact }) {
  const {
    data: { events },
    loading,
    error
  } = useQuery(QUERY_CONTACT_EVENTS, {
    variables: { query: { involvedContact: { id: contact.id } } }
  });
  const [editingEvent, setEditingEvent] = useState(false);
  const [newEventId, setNewEventId] = useState('');

  if (newEventId) {
    setTimeout(() => {
      if (newEventId) {
        setNewEventId('');
      }
    }, 1000);
  }

  if (loading) {
    return <Loader size="4" />;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <EventList showBorder={events.length > 0}>
        <CreateEventContainer>
          <CreateEventButton
            onClick={() => setEditingEvent({ involvedContacts: [contact] })}
          >
            Add Event
          </CreateEventButton>
        </CreateEventContainer>
        {events
          .sort(
            ({ date: firstDate }, { date: secondDate }) =>
              moment(secondDate) - moment(firstDate)
          )
          .map((event) => (
            <EventCard key={event.id} isNew={event.id === newEventId}>
              <EventDate>{moment(event.date).format('MMM DD, YYYY')}</EventDate>
              <EventHeaderLine>
                <EventTitle>{event.type}</EventTitle>
                <EditButton onClick={() => setEditingEvent(event)}>
                  <Icon type="edit" />
                </EditButton>
              </EventHeaderLine>
              {event.note && <EventNote>{event.note}</EventNote>}
            </EventCard>
          ))}
      </EventList>
      <Modal
        isOpen={Boolean(editingEvent)}
        onRequestClose={() => setEditingEvent(false)}
        contentLabel="Adding Event"
        style={{ overlay: { zIndex: 1000 } }}
      >
        <EventForm
          event={editingEvent || { involvedContacts: [] }}
          refetchQuery={{
            query: QUERY_CONTACT_EVENTS,
            variables: { query: { involvedContact: { id: contact.id } } }
          }}
          onSubmit={({ id }) => {
            setEditingEvent(false);
            setNewEventId(id);
          }}
        />
      </Modal>
    </>
  );
}
ContactEventList.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string
  })
};
