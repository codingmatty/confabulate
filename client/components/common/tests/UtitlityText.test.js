import { cleanup } from 'react-testing-library';
import renderWithTheme from '../../../test-utils/render-with-theme';
import UtilityText from '../UtilityText';

describe('UtilityText', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = renderWithTheme(
      <UtilityText>Utility Text</UtilityText>
    );
    expect(container).toMatchSnapshot();
  });

  it('applies small styles', () => {
    const { container } = renderWithTheme(
      <UtilityText small>Utility Text</UtilityText>
    );
    expect(container).toMatchSnapshot();
  });
});
