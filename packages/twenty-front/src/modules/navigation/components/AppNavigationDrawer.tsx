import { useRecoilState, useRecoilValue } from 'recoil';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SettingsNavigationDrawerItems } from '@/settings/components/SettingsNavigationDrawerItems';
import { SupportDropdown } from '@/support/components/SupportDropdown';
import {
  NavigationDrawer,
  NavigationDrawerProps,
} from '@/ui/navigation/navigation-drawer/components/NavigationDrawer';
import { isAdvancedModeEnabledState } from '@/ui/navigation/navigation-drawer/states/isAdvancedModeEnabledState';

import { useIsSettingsDrawer } from '@/navigation/hooks/useIsSettingsDrawer';

import { usePermissions } from '@/auth/contexts/PermissionContext';
import { MainNavigationDrawerItems } from '@/navigation/components/MainNavigationDrawerItems';
import { AdvancedSettingsToggle } from 'twenty-ui';

export type AppNavigationDrawerProps = {
  className?: string;
};

export const AppNavigationDrawer = ({
  className,
}: AppNavigationDrawerProps) => {
  const isSettingsDrawer = useIsSettingsDrawer();

  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useRecoilState(
    isAdvancedModeEnabledState,
  );

  const { currentRole } = usePermissions();
  const drawerProps: NavigationDrawerProps = isSettingsDrawer
    ? {
        title: 'Exit Settings',
        children: <SettingsNavigationDrawerItems />,
        footer: (
          currentRole?.canAccessWorkspaceSettings ?
           <AdvancedSettingsToggle
            isAdvancedModeEnabled={isAdvancedModeEnabled}
            setIsAdvancedModeEnabled={setIsAdvancedModeEnabled}
            /> 
            :
            <></>
        ),
        logo: '',
      }
    : {
        logo: currentWorkspace?.logo ?? '',
        title: currentWorkspace?.displayName ?? '',
        children: <MainNavigationDrawerItems />,
        footer: <SupportDropdown />,
      };

  return (
    <NavigationDrawer
      className={className}
      logo={drawerProps.logo}
      title={drawerProps.title}
      footer={drawerProps.footer}
    >
      {drawerProps.children}
    </NavigationDrawer>
  );
};
