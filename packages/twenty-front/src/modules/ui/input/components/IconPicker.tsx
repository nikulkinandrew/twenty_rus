import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import {
  Dropdown,
  DropdownMenu,
  DropdownMenuItemsContainer,
  DropdownMenuSearchInput,
  DropdownMenuSeparator,
  IconApps,
  IconButton,
  IconButtonVariant,
  IconComponent,
  LightIconButton,
  SelectableList,
  useDropdown,
  useIcons,
  useSelectableList,
} from 'twenty-ui';

import { usePreviousHotkeyScope } from '@/ui/utilities/hotkey/hooks/usePreviousHotkeyScope';
import { arrayToChunks } from '~/utils/array/arrayToChunks';

import { IconPickerHotkeyScope } from '../types/IconPickerHotkeyScope';

type IconPickerProps = {
  disabled?: boolean;
  dropdownId?: string;
  onChange: (params: { iconKey: string; Icon: IconComponent }) => void;
  selectedIconKey?: string;
  onClickOutside?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  variant?: IconButtonVariant;
  className?: string;
  disableBlur?: boolean;
};

const StyledMenuIconItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

const StyledLightIconButton = styled(LightIconButton)<{ isSelected?: boolean }>`
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.background.transparent.medium : 'transparent'};
`;

const convertIconKeyToLabel = (iconKey: string) =>
  iconKey.replace(/[A-Z]/g, (letter) => ` ${letter}`).trim();

type IconPickerIconProps = {
  iconKey: string;
  onClick: () => void;
  selectedIconKey?: string;
  Icon: IconComponent;
};

const IconPickerIcon = ({
  iconKey,
  onClick,
  selectedIconKey,
  Icon,
}: IconPickerIconProps) => {
  const { isSelectedItemIdSelector } = useSelectableList();

  const isSelectedItemId = useRecoilValue(isSelectedItemIdSelector(iconKey));

  return (
    <StyledLightIconButton
      key={iconKey}
      aria-label={convertIconKeyToLabel(iconKey)}
      size="medium"
      title={iconKey}
      isSelected={iconKey === selectedIconKey || isSelectedItemId}
      Icon={Icon}
      onClick={onClick}
    />
  );
};

export const IconPicker = ({
  disabled,
  dropdownId = 'icon-picker',
  onChange,
  selectedIconKey,
  onClickOutside,
  onClose,
  onOpen,
  variant = 'secondary',
  disableBlur = false,
  className,
}: IconPickerProps) => {
  const [searchString, setSearchString] = useState('');
  const {
    goBackToPreviousHotkeyScope,
    setHotkeyScopeAndMemorizePreviousScope,
  } = usePreviousHotkeyScope();

  const { closeDropdown } = useDropdown(dropdownId);

  const { getIcons, getIcon } = useIcons();
  const icons = getIcons();
  const matchingSearchIconKeys = useMemo(() => {
    const filteredIconKeys = icons
      ? Object.keys(icons).filter((iconKey) => {
          if (searchString === '') {
            return true;
          }

          const isMatchingSearchString = [
            iconKey,
            convertIconKeyToLabel(iconKey),
          ].some((label) =>
            label.toLowerCase().includes(searchString.toLowerCase()),
          );

          return isMatchingSearchString;
        })
      : [];

    const isSelectedIconMatchingFilter =
      selectedIconKey && filteredIconKeys.includes(selectedIconKey);

    const uniqueFilteredIconKeys = [
      ...new Set(
        selectedIconKey && isSelectedIconMatchingFilter
          ? [selectedIconKey, ...filteredIconKeys]
          : filteredIconKeys,
      ),
    ];

    return uniqueFilteredIconKeys.slice(0, 25);
  }, [icons, searchString, selectedIconKey]);

  const iconKeys2d = useMemo(
    () => arrayToChunks(matchingSearchIconKeys.slice(), 5),
    [matchingSearchIconKeys],
  );

  return (
    <div className={className}>
      <Dropdown
        dropdownId={dropdownId}
        dropdownHotkeyScope={{ scope: IconPickerHotkeyScope.IconPicker }}
        clickableComponent={
          <IconButton
            disabled={disabled}
            Icon={selectedIconKey ? getIcon(selectedIconKey) : IconApps}
            variant={variant}
          />
        }
        dropdownMenuWidth={176}
        disableBlur={disableBlur}
        dropdownComponents={
          <SelectableList
            selectableListId="icon-list"
            selectableItemIdMatrix={iconKeys2d}
            hotkeyScope={IconPickerHotkeyScope.IconPicker}
            onEnter={(iconKey) => {
              onChange({ iconKey, Icon: getIcon(iconKey) });
              closeDropdown();
            }}
          >
            <DropdownMenu width={176}>
              <DropdownMenuSearchInput
                placeholder="Search icon"
                autoFocus
                onChange={(event) => {
                  setSearchString(event.target.value);
                }}
              />
              <DropdownMenuSeparator />
              <div
                onMouseEnter={() => {
                  setHotkeyScopeAndMemorizePreviousScope(
                    IconPickerHotkeyScope.IconPicker,
                  );
                }}
                onMouseLeave={goBackToPreviousHotkeyScope}
              >
                <DropdownMenuItemsContainer>
                  <StyledMenuIconItemsContainer>
                    {matchingSearchIconKeys.map((iconKey) => (
                      <IconPickerIcon
                        key={iconKey}
                        iconKey={iconKey}
                        onClick={() => {
                          onChange({ iconKey, Icon: getIcon(iconKey) });
                          closeDropdown();
                        }}
                        selectedIconKey={selectedIconKey}
                        Icon={getIcon(iconKey)}
                      />
                    ))}
                  </StyledMenuIconItemsContainer>
                </DropdownMenuItemsContainer>
              </div>
            </DropdownMenu>
          </SelectableList>
        }
        onClickOutside={onClickOutside}
        onClose={() => {
          onClose?.();
          setSearchString('');
        }}
        onOpen={onOpen}
      />
    </div>
  );
};
