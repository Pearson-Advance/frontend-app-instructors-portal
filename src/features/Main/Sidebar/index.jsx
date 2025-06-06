import React from 'react';
import { useHistory } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sidebar as SidebarBase,
  MenuSection,
  MenuItem,
  SIDEBAR_HELP_ITEMS,
  getUserRoles,
  USER_ROLES,
} from 'react-paragon-topaz';

import { useInstitutionIdQueryParam } from 'hooks';
import { updateActiveTab } from 'features/Main/data/slice';

const baseItems = [
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
  const roles = getUserRoles();
  const activeTab = useSelector((state) => state.main.activeTab);
  const currentSelection = activeTab.replace(/\?institutionId=\d+/, '');
  const menuItems = [...baseItems];
  const institutionPortalPath = getConfig().INSTITUTION_PORTAL_PATH || '';
  const adminRoles = [USER_ROLES.GLOBAL_STAFF, USER_ROLES.INSTITUTION_ADMIN];

  if (adminRoles.some(role => roles.includes(role)) && institutionPortalPath.length > 0) {
    menuItems.push({
      link: 'institution-portal',
      as: 'a',
      href: institutionPortalPath,
      label: 'Skilling Administrator',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: <i className="fa-regular fa-user-gear" />,
    });
  }

  const handleTabClick = (tabName) => {
    dispatch(updateActiveTab(tabName));
    history.push(`/${tabName}`);
  };

  const addQueryParam = useInstitutionIdQueryParam();

  return (
    <SidebarBase>
      <MenuSection>
        {
           menuItems.map(({
             link, label, icon, as, href, target, rel,
           }) => {
             if (as === 'a') {
               return (
                 <MenuItem
                   key={link}
                   title={label}
                   as={as}
                   href={href}
                   icon={icon}
                   target={target}
                   rel={rel}
                 />
               );
             }

             return (
               <MenuItem
                 key={link}
                 title={label}
                 path={addQueryParam(link)}
                 active={currentSelection === link}
                 onClick={handleTabClick}
                 icon={icon}
               />
             );
           })
        }
      </MenuSection>
      <MenuSection title="Help and support">
        {
          SIDEBAR_HELP_ITEMS.map(({
            link,
            label,
            ...rest
          }) => (
            <MenuItem
              key={link}
              title={label}
              as="a"
              href={link}
              {...rest}
            />
          ))
        }
      </MenuSection>
    </SidebarBase>
  );
};
