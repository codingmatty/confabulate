import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledForm = styled.form`
  width: 100%;
`;
const Fieldset = styled.fieldset`
  border: none;
  padding: 0;

  &[disabled] {
    opacity: 0.5;
  }
`;
const commonButtonStyles = `
border: none;
cursor: pointer;
display: block;
font-size: 1rem;
height: 2.5rem;
width: 100%;
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.color.neutrals[3]};
  margin-top: 1rem;
  ${commonButtonStyles}
`;
const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.color.greens[3]};
  margin-top: 2rem;

  ${commonButtonStyles}
`;

export default function Form({
  children,
  disabled,
  onSubmit,
  submitLabel,
  onCancel
}) {
  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
  return (
    <StyledForm onSubmit={onFormSubmit} autoComplete="off">
      <Fieldset disabled={disabled}>
        {children}
        {submitLabel && (
          <SubmitButton type="submit">{submitLabel}</SubmitButton>
        )}
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
        )}
      </Fieldset>
    </StyledForm>
  );
}
Form.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string
};
