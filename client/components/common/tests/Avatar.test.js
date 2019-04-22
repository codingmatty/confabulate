import { cleanup } from 'react-testing-library';
import md5 from 'md5-o-matic';
import renderWithTheme from '../../../test-utils/render-with-theme';
import Avatar from '../Avatar';

describe('Avatar', () => {
  afterEach(cleanup);

  it('matches default snapshot', () => {
    const { container } = renderWithTheme(<Avatar email="test@email.com" />);
    expect(container).toMatchSnapshot();
  });

  it('allows image before using email', () => {
    const { container } = renderWithTheme(
      <Avatar image="image.url" email="test@email.com" />
    );
    expect(container).toMatchSnapshot();
  });

  it('includes an img with gravatar src', () => {
    const { container } = renderWithTheme(<Avatar email="test@email.com" />);
    const hash = md5('test@email.com');
    const expectedSrc = `https://s.gravatar.com/avatar/${hash}?s=96&d=mp`;
    expect(container.querySelector('img')).toHaveAttribute('src', expectedSrc);
  });

  it('does not throw when no email is provided', () => {
    expect(() => renderWithTheme(<Avatar />)).not.toThrow();
  });

  it('takes size attribute', () => {
    const { container } = renderWithTheme(
      <Avatar email="test@email.com" size={4} />
    );
    const hash = md5('test@email.com');
    const expectedSrc = `https://s.gravatar.com/avatar/${hash}?s=128&d=mp`;
    expect(container.querySelector('img')).toHaveAttribute('src', expectedSrc);
  });
});
