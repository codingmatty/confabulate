import flatten from 'flat';
import omitBy from 'lodash/omitBy';

export default function omitTypename(obj) {
  return flatten.unflatten(
    omitBy(flatten(obj), (v, key) => key.endsWith('__typename'))
  );
}
