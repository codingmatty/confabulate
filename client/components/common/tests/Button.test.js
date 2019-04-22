import { cleanup } from 'react-testing-library';
import renderWithTheme from '../../../test-utils/render-with-theme';
import Button from '../Button';

describe('Button', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = renderWithTheme(<Button />);
    expect(container).toMatchSnapshot();
  });

  it('applies primary styles', () => {
    const { container } = renderWithTheme(<Button type="primary" />);
    expect(container).toMatchSnapshot();
  });

  it('applies destructive styles', () => {
    const { container } = renderWithTheme(<Button type="destructive" />);
    expect(container).toMatchSnapshot();
  });

  it('applies transparent styles', () => {
    const { container } = renderWithTheme(<Button type="transparent" />);
    expect(container).toMatchSnapshot();
  });

  it('applies neutral styles', () => {
    const { container } = renderWithTheme(<Button type="neutral" />);
    expect(container).toMatchSnapshot();
  });

  it('adds full width style', () => {
    const { container } = renderWithTheme(<Button fullWidth />);
    expect(container.firstChild).toHaveStyleRule('width', '100%');
  });
});
