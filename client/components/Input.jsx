import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputWrapper = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;
const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 0.5rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;
const InputControl = styled.input`
  border: 1px solid gray;
  box-sizing: border-box;
  display: block;
  height: 2rem;
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
  return (
    <InputWrapper>
      <Label htmlFor={id}>{label}</Label>
      <InputControl
        id={id}
        type={type}
        name={name}
        value={value}
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
