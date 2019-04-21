import merge from 'lodash/merge';
import Modal from 'react-modal';
import styled, { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import Button from './common/Button';

const Content = styled.div`
  padding: 1rem;
`;
const Actions = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`;
const ActionButton = styled(Button)`
  font-weight: bold;
  & + & {
    margin-left: 0.5rem;
  }
`;

const DialogStyles = createGlobalStyle`
  .dialog--overlay {
    position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: ${({ theme }) => rgba(theme.color.neutrals[5], 0.75)};
  z-index: 10000;
  }
  .dialog--content {
    position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border: ${({ theme }) => theme.color.neutrals[5]};
  background-color: white;
  overflow: auto;
  border-radius: 4px;
  outline: none;
  height: fit-content;
  width: fit-content;
  margin: auto;
  }
`;

const defaultLabels = {
  ok: {
    text: 'Ok',
    type: 'primary'
  },
  yes: {
    text: 'Yes',
    type: 'primary'
  },
  no: {
    text: 'No',
    type: 'neutral'
  }
};

export default function Dialog({
  message,
  isOpen,
  labels,
  type,
  onConfirm,
  onDeny
}) {
  const applyLabels = merge({}, defaultLabels, labels);
  return (
    <>
      <DialogStyles />
      <Modal
        isOpen={isOpen}
        className="dialog--content"
        overlayClassName="dialog--overlay"
      >
        <Content>{message}</Content>
        <Actions>
          {type === 'confirm' ? (
            <ActionButton type={applyLabels.ok.type} onClick={onConfirm}>
              {applyLabels.ok.text}
            </ActionButton>
          ) : (
            <>
              <ActionButton type={applyLabels.no.type} onClick={onDeny}>
                {applyLabels.no.text}
              </ActionButton>
              <ActionButton type={applyLabels.yes.type} onClick={onConfirm}>
                {applyLabels.yes.text}
              </ActionButton>
            </>
          )}
        </Actions>
      </Modal>
    </>
  );
}
Dialog.propTypes = {
  message: PropTypes.string,
  isOpen: PropTypes.bool,
  type: PropTypes.oneOf('confirm', 'option'),
  onConfirm: PropTypes.func,
  onDeny: PropTypes.func,
  labels: PropTypes.shape({
    ok: PropTypes.shape({ text: PropTypes.string, type: PropTypes.string }),
    yes: PropTypes.shape({ text: PropTypes.string, type: PropTypes.string }),
    no: PropTypes.shape({ text: PropTypes.string, type: PropTypes.string })
  })
};
Dialog.defaultProps = {
  onConfirm: () => {},
  onDeny: () => {},
  type: 'confirm'
};
