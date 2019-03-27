import NextLink from 'next/link';
import PropTypes from 'prop-types';

export default function Link({ asUrl, children, className, href, innerRef }) {
  return (
    <NextLink as={asUrl} href={href}>
      <a className={className} ref={innerRef}>
        {children}
      </a>
    </NextLink>
  );
}
Link.propTypes = {
  asUrl: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  innerRef: PropTypes.func
};
