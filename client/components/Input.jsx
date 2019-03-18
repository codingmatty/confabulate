import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

const InputWrapper = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;
const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;
const InputControl = styled.input`
  border: 1px solid gray;
  box-sizing: border-box;
  display: block;
  font-size: 1.25rem;
  padding: 0.5rem;
  width: 100%;
`;
const Error = styled.div``;

export default function Input({
  error,
  id,
  label,
  name,
  onChange,
  required,
  type,
  value
}) {
  let normalizedValue = value;
  if (type === 'date') {
    normalizedValue = moment(value).format('YYYY-MM-DD');
  }
  return (
    <InputWrapper>
      <Label htmlFor={id}>{label}</Label>
      <InputControl
        id={id}
        type={type}
        name={name}
        value={normalizedValue}
        onChange={onChange}
        required={required}
      />
      {error && <Error>{error}</Error>}
    </InputWrapper>
  );
}

Input.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool
};
Input.defaultProps = {
  type: 'text'
};
