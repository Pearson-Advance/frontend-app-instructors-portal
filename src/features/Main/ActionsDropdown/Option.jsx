import { Dropdown } from '@openedx/paragon';
import PropTypes from 'prop-types';

const Option = ({
  iconSrc, handleClick, label, disabled,
}) => (
  <Dropdown.Item onClick={handleClick} disabled={disabled}>
    {iconSrc}
    {label}
  </Dropdown.Item>
);

Option.defaultProps = {
  iconSrc: '',
  disabled: false,
};

Option.propTypes = {
  iconSrc: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Option;
