import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar as SidebarBase, MenuSection, MenuItem } from 'react-paragon-topaz';

import { useInstitutionIdQueryParam } from 'hooks';
import { updateActiveTab } from 'features/Main/data/slice';

const menuItems = [
  {
    link: 'dashboard',
    label: 'Home',
    icon: <i className="fa-regular fa-house" />,
  },
  {
    link: 'students',
    label: 'Students',
    icon: <i className="fa-solid fa-screen-users" />,
  },
  {
    link: 'classes',
    label: 'Classes',
    icon: <i className="fa-regular fa-bars-sort" />,
  },
  {
    link: 'my-profile',
    label: 'My profile',
    icon: <i className="fa-regular fa-user-group" />,
  },
];

export const Sidebar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.main.activeTab);
  const currentSelection = activeTab.replace(/\?institutionId=\d+/, '');

  const handleTabClick = (tabName) => {
    dispatch(updateActiveTab(tabName));
    history.push(`/${tabName}`);
  };

  const addQueryParam = useInstitutionIdQueryParam();

  return (
    <SidebarBase>
      <MenuSection>
        {
            menuItems.map(({ link, label, icon }) => (
              <MenuItem
                key={link}
                title={label}
                path={addQueryParam(link)}
                active={currentSelection === link}
                onClick={handleTabClick}
                icon={icon}
              />
            ))
        }
      </MenuSection>
    </SidebarBase>
  );
};
