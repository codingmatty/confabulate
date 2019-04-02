import styled from 'styled-components';
import EventList from '../../components/EventList';
import PageTitle from '../../components/PageTitle';
import Icon from '../../components/Icon';
import Link from '../../components/Link';

const CreateEventLink = styled(Link)`
  background-color: white;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.color.greens[4]};
  bottom: 1.5rem;
  box-shadow: 3px 3px 15px -6px ${({ theme }) => theme.color.neutrals[7]};
  color: ${({ theme }) => theme.color.greens[4]};
  font-size: 2rem;
  line-height: 0;
  padding: 0.5rem;
  position: fixed;
  right: 1.5rem;
`;
const StyledeventsPage = styled.div`
  margin-bottom: 3rem;
`;

export default function events() {
  return (
    <StyledeventsPage>
      <PageTitle>Events</PageTitle>
      <EventList />
      {/* <CreateEventLink href="/events/create">
        <Icon type="add" />
      </CreateEventLink> */}
    </StyledeventsPage>
  );
}
