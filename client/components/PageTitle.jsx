import UtilityText from './styled/UtilityText';

export default function PageTitle({ children }) {
  return <UtilityText as="h1">{children}</UtilityText>;
}
