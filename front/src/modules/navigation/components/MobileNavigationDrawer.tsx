import { useRecoilState } from 'recoil';

import { Favorites } from '@/favorites/components/Favorites';
import { SettingsNavbar } from '@/settings/components/SettingsNavbar';
import { navigationDrawerState } from '@/ui/layout/states/navigationDrawerState';
import MainNavbar from '@/ui/navigation/navigation-drawer/components/MainNavbar';

import { WorkspaceNavItems } from './WorkspaceNavItems';

export const MobileNavigationDrawer = () => {
  const [navigationDrawer] = useRecoilState(navigationDrawerState);

  return navigationDrawer === 'settings' ? (
    <SettingsNavbar />
  ) : (
    <MainNavbar>
      <Favorites />
      <WorkspaceNavItems />
    </MainNavbar>
  );
};
