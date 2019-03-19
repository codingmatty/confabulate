import styled from 'styled-components';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import moment from 'moment';
import Modal from 'react-modal';
import ContactForm from './ContactForm';
import Avatar from './Avatar';
import FavoriteContact from './FavoriteContact';
import Icon from './Icon';
import EventForm from './EventForm';

const QUERY_CONTACT = gql`
  query QUERY_CONTACT($id: ID!) {
    contact(id: $id) {
      id
      firstName
      lastName
      fullName
      email
      phoneNumber
      favorite
      events {
        id
        title
        date
        type
        note
      }
    }
  }
`;

const ContactCard = styled.div`
  position: relative;
  padding: calc(60px + 1rem) 1rem 1rem 1rem;
  margin-top: 60px;
  border: 1px solid #888;
  border-radius: 4px;
  box-shadow: 2px 2px 4px -2px #333;
  background-color: white;
  z-index: 1;
`;
const StyledContactAvatar = styled(Avatar)`
  position: absolute;
  margin: 0 auto;
  top: -60px;
  display: block;
  left: 0;
  right: 0;
  box-shadow: 0 0 6px 1px #333;
`;
const ContactDetails = styled.ul`
  list-style: none;
  padding: 0;
  width: fit-content;
  margin: 1rem auto;
`;
const ContactDetail = styled.li`
  line-height: 1.5;
  display: flex;
  align-items: center;
`;
const ContactIcon = styled(Icon)`
  margin-right: 0.5rem;
`;
const ContactName = styled.h1`
  margin-top: 0;
  text-align: center;
`;
const StyledFavoriteContact = styled(FavoriteContact)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;
const EditButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 1.5rem;
`;
const EventTitle = styled.div``;
const EventHeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
`;
const EventDate = styled.span`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
`;
const EventType = styled.span``;
const EventSubheaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  line-height: 1.5;
`;
const EventNote = styled.p`
  margin-bottom: 0;
`;
const EventCard = styled.li`
  padding: 1rem;
  position: relative;
  border: 1px solid #888;
  border-radius: 4px;
  box-shadow: 2px 2px 4px -2px #333;
  margin-left: 2.5rem;
  margin-right: 0.5rem;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
  &::before {
    content: '';
    border: 2px solid #ccc;
    position: absolute;
    height: calc(100% + 0.5rem + 2px);
    left: -1.25rem;
    top: 0;
  }
  &:last-child::before {
    height: 50%;
  }
  &::after {
    content: '';
    transform: rotate(45deg);
    background-color: #444;
    position: absolute;
    height: 0.6rem;
    width: 0.6rem;
    top: calc(50% - 0.3rem);
    left: -1.425rem;
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
  position: relative;
  padding: 1rem;
  &::before {
    content: '';
    border: 2px solid #ccc;
    position: absolute;
    height: calc(100% + 1rem);
    left: 1.3rem;
    top: -0.5rem;
  }
`;
const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default function Contact({ id }) {
  const { data, loading, error } = useQuery(QUERY_CONTACT, {
    variables: { id }
  });
  const [editing, setEditing] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);
  const [contact, setContact] = useState(null);
  const [events, setEvents] = useState([]);

  if (!loading && !contact) {
    // sync the contact to state once it's queried
    setContact(data.contact);
    setEvents(data.contact.events);
  }
  if (loading || !contact) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      {editing ? (
        <>
          <h1>Editing Contact</h1>
          <ContactForm
            contact={contact}
            onSubmit={(updatedContact) => {
              setContact(updatedContact);
              setEditing(false);
            }}
          />
        </>
      ) : (
        <>
          <ContactCard>
            <EditButton onClick={() => setEditing(true)}>
              <Icon type="edit" />
            </EditButton>
            <StyledFavoriteContact
              contactId={contact.id}
              isFavorite={contact.favorite}
            />
            <StyledContactAvatar email={contact.email} size={120} />
            <ContactName>
              {contact.firstName} {contact.lastName}
            </ContactName>
            <ContactDetails>
              <ContactDetail>
                <ContactIcon type="mail" /> {contact.email}
              </ContactDetail>
              <ContactDetail>
                <ContactIcon type="phone" />{' '}
                {contact.phoneNumber.replace(
                  /(\d{3})(\d{3})(\d{4})/,
                  '($1) $2-$3'
                )}
              </ContactDetail>
            </ContactDetails>
          </ContactCard>
          <EventList>
            <CreateEventContainer>
              <CreateEventButton onClick={() => setAddingEvent(true)}>
                Add Event
              </CreateEventButton>
            </CreateEventContainer>
            {events
              .sort(
                ({ date: firstDate }, { date: secondDate }) =>
                  moment(secondDate) - moment(firstDate)
              )
              .map((event) => (
                <EventCard key={event.id}>
                  <EventHeaderLine>
                    <EventTitle>{event.title}</EventTitle>
                    <Icon type="edit" />
                  </EventHeaderLine>
                  <EventSubheaderLine>
                    <EventDate>
                      {moment(event.date).format('MMMM DD, YYYY')}
                    </EventDate>
                    <EventType>{event.type}</EventType>
                  </EventSubheaderLine>
                  {event.note && <EventNote>{event.note}</EventNote>}
                </EventCard>
              ))}
          </EventList>
          <Modal
            isOpen={addingEvent}
            onRequestClose={() => setAddingEvent(false)}
            contentLabel="Adding Event"
            style={{ overlay: { zIndex: 1000 } }}
          >
            <EventForm
              event={{ involvedContacts: [contact] }}
              onSubmit={(event) => {
                setAddingEvent(false);
                setEvents(events.concat(event));
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
}
Contact.propTypes = {
  id: PropTypes.string.isRequired
};
