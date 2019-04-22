import { cleanup, render } from 'react-testing-library';
import Icon from '../Icon';

describe('Icon', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = render(<Icon type="test" />);
    expect(container).toMatchSnapshot();
  });

  it('sets className', () => {
    const { container } = render(<Icon type="test" className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('adds bold font-weight', () => {
    const { container } = render(<Icon type="test" bold />);
    expect(container.firstChild).toHaveStyleRule('font-weight', 'bold');
  });
});
