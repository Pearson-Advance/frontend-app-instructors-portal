import { Dropdown } from '@edx/paragon';
import PropTypes from 'prop-types';

const Option = ({ iconSrc, handleClick, label }) => (
  <Dropdown.Item onClick={handleClick}>
    {iconSrc}
    {label}
  </Dropdown.Item>
);

Option.defaultProps = {
  iconSrc: '',
};

Option.propTypes = {
  iconSrc: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Option;
