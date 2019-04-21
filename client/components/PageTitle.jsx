import UtilityText from './common/UtilityText';

export default function PageTitle({ children }) {
  return <UtilityText as="h1">{children}</UtilityText>;
}
