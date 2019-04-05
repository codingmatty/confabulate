import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const monthDayCount = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const BirthdayInputWrapper = styled.div`
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
const ControlsWrapper = styled.div`
  display: flex;
`;
const sharedInputStyles = css`
  border: 1px solid gray;
  border-radius: 2px;
  box-sizing: border-box;
  font-size: 1.25rem;
  padding: 0.5rem;
`;
const SelectControl = styled.select`
  ${sharedInputStyles};
  -webkit-appearance: textfield;
  background: none;
  width: 100%;
`;
const SelectControlWrapper = styled.div`
  position: relative;
  display: block;
  flex: 2;
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 8px;
    top: calc(50% - 3px);
    border-top: 6px solid black;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    pointer-events: none;
  }
`;
const InputControl = styled.input`
  ${sharedInputStyles};
  text-align: center;
  margin-left: 0.5rem;
  flex: 1;
`;
const Error = styled.div``;

export default function Input({
  error,
  id,
  label,
  name: birthdayName,
  onChange,
  required,
  value: birthdayValue
}) {
  const getValue = (birthdayProp) =>
    birthdayValue[birthdayProp] === null ? '' : birthdayValue[birthdayProp];

  const onBirthdayChange = ({ target: { name, value } }) => {
    onChange({
      target: {
        name: birthdayName,
        value: { ...birthdayValue, [name]: value === '' ? null : Number(value) }
      }
    });
  };
  const labelId = `${id}-label-id`;
  return (
    <BirthdayInputWrapper>
      <Label id={labelId}>{label}</Label>
      <ControlsWrapper>
        <SelectControlWrapper>
          <SelectControl
            aria-label="Month"
            aria-labelledby={`${labelId} month`}
            id={`${id}-month`}
            name="month"
            onChange={onBirthdayChange}
            required={required}
            value={getValue('month')}
          >
            <option value="">Month</option>
            {months.map((month, i) => (
              <option value={i} key={month}>
                {month}
              </option>
            ))}
          </SelectControl>
        </SelectControlWrapper>
        <InputControl
          aria-label="Day"
          aria-labelledby={`${labelId} ${id}-day`}
          id={`${id}-day`}
          max={monthDayCount[birthdayValue.month] || 31}
          min="1"
          name="day"
          onChange={onBirthdayChange}
          placeholder="Day"
          required={required}
          type="number"
          value={getValue('day')}
        />
        <InputControl
          aria-label="Year"
          aria-labelledby={`${labelId} ${id}-year`}
          id={`${id}-year`}
          max={moment().year()}
          min="1900"
          name="year"
          onChange={onBirthdayChange}
          placeholder="Year"
          required={required}
          type="number"
          value={getValue('year')}
        />
      </ControlsWrapper>
      {error && <Error>{error}</Error>}
    </BirthdayInputWrapper>
  );
}

Input.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.shape({
    day: PropTypes.number,
    month: PropTypes.number,
    year: PropTypes.number
  }),
  required: PropTypes.bool
};
Input.defaultProps = {
  type: 'text'
};
