import { SettingsAccountsConnectedAccountsSection } from '@/settings/accounts/components/SettingsAccountsConnectedAccountsSection';
import { SettingsAccountsSettingsSection } from '@/settings/accounts/components/SettingsAccountsSettingsSection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { IconSettings } from '@/ui/display/icon';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';

export const SettingsIntegrations = () => {
  return (
    <SubMenuTopBarContainer Icon={IconSettings} title="Settings">
      <SettingsPageContainer>
        <Breadcrumb links={[{ children: 'Integrations' }]} />
        <SettingsAccountsConnectedAccountsSection />
        <SettingsAccountsSettingsSection />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
