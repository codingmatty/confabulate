import PropTypes from 'prop-types';
import Contact from '../../components/Contact';

export default function ContactInfo({ id }) {
  return <Contact id={id} />;
}
ContactInfo.getInitialProps = ({ query: { id } }) => ({ id });
ContactInfo.propTypes = {
  id: PropTypes.string
};
