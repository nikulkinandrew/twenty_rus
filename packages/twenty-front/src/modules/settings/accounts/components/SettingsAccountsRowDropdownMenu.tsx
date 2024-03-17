import { useNavigate } from 'react-router-dom';
import {
  Dropdown,
  DropdownMenu,
  DropdownMenuItemsContainer,
  IconDotsVertical,
  IconMail,
  IconTrash,
  LightIconButton,
  MenuItem,
  useDropdown,
} from 'twenty-ui';

import { ConnectedAccount } from '@/accounts/types/ConnectedAccount';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';

type SettingsAccountsRowDropdownMenuProps = {
  item: Pick<ConnectedAccount, 'id' | 'messageChannels'>;
  className?: string;
};

export const SettingsAccountsRowDropdownMenu = ({
  item: account,
  className,
}: SettingsAccountsRowDropdownMenuProps) => {
  const dropdownId = `settings-account-row-${account.id}`;

  const navigate = useNavigate();
  const { closeDropdown } = useDropdown(dropdownId);

  const { deleteOneRecord } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.ConnectedAccount,
  });

  return (
    <Dropdown
      dropdownId={dropdownId}
      className={className}
      dropdownPlacement="right-start"
      dropdownHotkeyScope={{ scope: dropdownId }}
      clickableComponent={
        <LightIconButton Icon={IconDotsVertical} accent="tertiary" />
      }
      dropdownComponents={
        <DropdownMenu>
          <DropdownMenuItemsContainer>
            <MenuItem
              LeftIcon={IconMail}
              text="Emails settings"
              onClick={() => {
                navigate(
                  `/settings/accounts/emails/${account.messageChannels.edges[0].node.id}`,
                );
                closeDropdown();
              }}
            />
            <MenuItem
              accent="danger"
              LeftIcon={IconTrash}
              text="Remove account"
              onClick={() => {
                deleteOneRecord(account.id);
                closeDropdown();
              }}
            />
          </DropdownMenuItemsContainer>
        </DropdownMenu>
      }
    />
  );
};
