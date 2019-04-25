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
const Error = styled.div`
  font-weight: bold;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${({ theme }) => theme.color.reds[4]};
`;

export default function Input({
  error,
  id,
  label,
  type,
  value,
  className,
  ...props
}) {
  let normalizedValue = value;
  if (type === 'date') {
    normalizedValue = moment(value).format('YYYY-MM-DD');
  }
  return (
    <InputWrapper className={className}>
      <Label htmlFor={id}>{label}</Label>
      <InputControl
        as={type === 'textarea' && 'textarea'}
        type={type}
        value={normalizedValue}
        {...props}
      />
      {error && <Error>{error}</Error>}
    </InputWrapper>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};
Input.defaultProps = {
  type: 'text'
};
