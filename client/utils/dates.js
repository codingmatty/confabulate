import moment from 'moment';

export function convertBirthdayToString(birthday) {
  if (birthday.year && birthday.day && birthday.month) {
    return moment(birthday).format('MMMM D, YYYY');
  } else if (birthday.day && birthday.month) {
    return moment(birthday).format('MMMM D');
  } else if (birthday.month) {
    return moment(birthday).format('MMMM');
  }
}
