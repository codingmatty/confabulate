import PropTypes from 'prop-types';
import styled from 'styled-components';

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  height: 100%;

  &[disabled] {
    opacity: 0.5;
  }
`;
const StyledForm = styled.form`
  width: 100%;
  height: 100%;
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
        <ControlsWrapper>
          {children}
          {submitLabel && (
            <SubmitButton type="submit">{submitLabel}</SubmitButton>
          )}
          {onCancel && (
            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>
          )}
        </ControlsWrapper>
      </Fieldset>
    </StyledForm>
  );
}
Form.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onCancel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string
};
