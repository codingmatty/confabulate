import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormWrapper = styled.form`
  width: 100%;
`;
const Fieldset = styled.fieldset`
  border: none;
  padding: 0;

  &[disabled] {
    opacity: 0.5;
  }
`;
const SubmitButton = styled.button`
  background-color: lightblue;
  border: none;
  cursor: pointer;
  display: block;
  margin-top: 2rem;
  font-size: 1rem;
  height: 2.5rem;
  width: 100%;
`;

export default function Form({ children, disabled, onSubmit, submitLabel }) {
  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
  return (
    <FormWrapper onSubmit={onFormSubmit} autoComplete="off">
      <Fieldset disabled={disabled}>
        {children}
        {submitLabel && (
          <SubmitButton type="submit">{submitLabel}</SubmitButton>
        )}
      </Fieldset>
    </FormWrapper>
  );
}
Form.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string
};
