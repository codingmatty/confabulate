import { render, cleanup } from 'react-testing-library';
import Icon from '../Icon';

describe('Icon', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = render(<Icon type="test" />);
    expect(container).toMatchSnapshot();
  });

  it('adds bold font-weight', () => {
    const { container } = render(<Icon type="test" bold />);
    expect(container.firstChild).toHaveStyleRule('font-weight', 'bold');
  });

  it('sets font-size', () => {
    const { container } = render(<Icon type="test" size="1rem" />);
    expect(container.firstChild).toHaveStyleRule('font-size', '1rem');
  });
});
