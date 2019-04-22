import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import theme from '../utils/theme';

export default function renderWithTheme(component) {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
}
