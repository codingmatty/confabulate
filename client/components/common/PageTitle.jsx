import PropTypes from 'prop-types';
import UtilityText from './UtilityText';

export default function PageTitle({ children }) {
  return <UtilityText as="h1">{children}</UtilityText>;
}
PageTitle.propTypes = {
  children: PropTypes.node.isRequired
};
