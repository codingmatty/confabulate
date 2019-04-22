import { cleanup } from 'react-testing-library';
import renderWithTheme from '../../../test-utils/render-with-theme';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = renderWithTheme(<PageTitle>Page Title</PageTitle>);
    expect(container).toMatchSnapshot();
  });

  it('renders h1', () => {
    const { container } = renderWithTheme(<PageTitle>Page Title</PageTitle>);
    expect(container.firstChild.tagName).toBe('H1');
  });
});
