import { Dropdown, Icon, IconButton } from '@edx/paragon';
import { MoreHoriz, MoreVert } from '@edx/paragon/icons';
import PropTypes from 'prop-types';

import Option from './Option';

/**
 * Renders a dropdown menu with extra options.
 *
 * @param {object} props The component props.
 * @param {object[]} props.options Each option is an object with keys:
 *   - `iconSrc`: The URL of the icon to show for the option.
 *   - `handleClick`: The function to call when the option is clicked.
 *   - `label`: The text to display for the option.
 *   - `visible`: Whether the option is visible
 * @param {boolean} props.vertIcon Whether to use the vertical "more" icon.
 *
 * @returns {ReactElement} The rendered dropdown menu.
 */
const ActionsDropdown = ({ options, vertIcon }) => (
  <Dropdown
    className="dropdowntpz ml-3"
    style={{ position: 'unset' }}
  >
    <Dropdown.Toggle
      as={IconButton}
      src={vertIcon ? MoreVert : MoreHoriz}
      iconAs={Icon}
      variant="primary"
      alt="menu for actions"
    />
    <Dropdown.Menu>
      {options.map((option) => {
        if (option.visible) {
          return <Option key={option.label} {...option} />;
        }
        return null;
      })}
    </Dropdown.Menu>
  </Dropdown>
);

ActionsDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    iconSrc: PropTypes.string,
    handleClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  })).isRequired,
  vertIcon: PropTypes.bool,
};

ActionsDropdown.defaultProps = {
  vertIcon: true,
};

export default ActionsDropdown;
