import { Account } from '@/accounts/types/Account';
import { InboxSettingsVisibilityValue } from '@/settings/accounts/components/SettingsAccountsInboxSettingsVisibilitySection';

export const mockedAccounts: Account[] = [
  {
    email: 'thomas@twenty.com',
    isSynced: true,
    uuid: '0794b782-f52e-48c3-977e-b0f57f90de24',
    visibility: InboxSettingsVisibilityValue.Everything,
  },
  {
    email: 'thomas@twenty.dev',
    isSynced: false,
    uuid: 'dc66a7ec-56b2-425b-a8e8-26ff0396c3aa',
    visibility: InboxSettingsVisibilityValue.Metadata,
  },
];
