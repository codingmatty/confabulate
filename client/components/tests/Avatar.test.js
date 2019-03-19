import { render, cleanup } from 'react-testing-library';
import md5 from 'md5-o-matic';
import Avatar from '../Avatar';

describe('Avatar', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = render(<Avatar email="test@email.com" />);
    expect(container).toMatchSnapshot();
  });

  it('includes an img with gravatar src', () => {
    const { container } = render(<Avatar email="test@email.com" />);
    const hash = md5('test@email.com');
    const expectedSrc = `https://s.gravatar.com/avatar/${hash}?s=100&d=mp`;
    expect(container.querySelector('img')).toHaveAttribute('src', expectedSrc);
  });

  it('takes size attribute', () => {
    const { container } = render(<Avatar email="test@email.com" size={100} />);
    const hash = md5('test@email.com');
    const expectedSrc = `https://s.gravatar.com/avatar/${hash}?s=200&d=mp`;
    expect(container.querySelector('img')).toHaveAttribute('src', expectedSrc);
  });
});
