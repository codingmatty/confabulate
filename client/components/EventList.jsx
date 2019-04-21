import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import Loader from './Loader';

const QUERY_EVENTS = gql`
  query QUERY_EVENTS {
    events {
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
// const EditButton = styled.button`
//   background: none;
//   border: none;
//   border-radius: 50%;
//   font-size: 1rem;
//   padding: 0;
// `;
const EventDate = styled.span`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
`;
const EventNote = styled.p`
  margin: 0.5rem 0 0;
`;
const EventCard = styled.li`
  position: relative;
  padding: 1rem 0;

  &:first-child {
    padding-top: 0;
  }
`;
const StyledEventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
`;

export default function EventList({ search }) {
  const {
    data: { events },
    loading,
    error
  } = useQuery(QUERY_EVENTS);
  const [newEventId, setNewEventId] = useState('');

  if (newEventId) {
    setTimeout(() => {
      if (newEventId) {
        setNewEventId('');
      }
    }, 1000);
  }

  if (loading) {
    return <Loader size="5" />;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <StyledEventList>
      {events
        .sort(
          ({ date: firstDate }, { date: secondDate }) =>
            moment(secondDate) - moment(firstDate)
        )
        .filter((event) =>
          Object.values(event)
            .join('')
            .toLowerCase()
            .includes(search)
        )
        .map((event) => (
          <EventCard key={event.id} isNew={event.id === newEventId}>
            <EventDate>{moment(event.date).format('MMM DD, YYYY')}</EventDate>
            <EventHeaderLine>
              <EventTitle>{event.type}</EventTitle>
              {/* <EditButton onClick={() => setEditingEvent(event)}>
                <Icon type="edit" />
              </EditButton> */}
            </EventHeaderLine>
            {event.note && <EventNote>{event.note}</EventNote>}
          </EventCard>
        ))}
    </StyledEventList>
  );
}
EventList.propTypes = {
  search: PropTypes.string
};
