import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  :not(:first-child) {
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
  border: 1px solid ${({ theme }) => theme.color.neutrals[3]};
  box-sizing: border-box;
  display: block;
  font-size: 1rem;
  padding: 0.5rem;
  width: 100%;
  border-radius: 2px;
  flex-grow: 1;
`;
const Error = styled.div``;

export default function Input({
  error,
  disabled,
  id,
  label,
  name,
  onChange,
  required,
  type,
  value,
  placeholder,
  className
}) {
  let normalizedValue = value;
  if (type === 'date') {
    normalizedValue = moment(value).format('YYYY-MM-DD');
  }
  return (
    <InputWrapper className={className}>
      <Label htmlFor={id}>{label}</Label>
      <InputControl
        id={id}
        type={type}
        name={name}
        value={normalizedValue}
        onChange={onChange}
        required={required}
        as={type === 'textarea' && 'textarea'}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <Error>{error}</Error>}
    </InputWrapper>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string
};
Input.defaultProps = {
  type: 'text'
};
