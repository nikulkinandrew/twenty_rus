import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { HotkeyEffect } from '@/ui/utilities/hotkey/components/HotkeyEffect';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';
import { getScopeIdFromComponentId } from '@/ui/utilities/recoil-scope/utils/getScopeIdFromComponentId';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  Placement,
  size,
  useFloating,
} from '@floating-ui/react';
import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Keys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { isDefined } from '~/utils/isDefined';

import { useDropdown } from '../hooks/useDropdown';
import { useInternalHotkeyScopeManagement } from '../hooks/useInternalHotkeyScopeManagement';

import { DropdownUnmountEffect } from '@/ui/layout/dropdown/components/DropdownUnmountEffect';
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponeInstanceContext';
import { dropdownMaxHeightComponentStateV2 } from '@/ui/layout/dropdown/states/dropdownMaxHeightComponentStateV2';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentStateV2';
import { DropdownMenu } from './DropdownMenu';
import { DropdownOnToggleEffect } from './DropdownOnToggleEffect';

type DropdownProps = {
  className?: string;
  clickableComponent?: ReactNode;
  dropdownComponents: ReactNode;
  hotkey?: {
    key: Keys;
    scope: string;
  };
  dropdownHotkeyScope: HotkeyScope;
  dropdownId: string;
  dropdownPlacement?: Placement;
  dropdownMenuWidth?: `${string}px` | `${number}%` | 'auto' | number;
  dropdownOffset?: { x?: number; y?: number };
  dropdownStrategy?: 'fixed' | 'absolute';
  disableBlur?: boolean;
  onClickOutside?: () => void;
  usePortal?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

export const Dropdown = ({
  className,
  clickableComponent,
  dropdownComponents,
  dropdownMenuWidth,
  hotkey,
  dropdownId,
  dropdownHotkeyScope,
  dropdownPlacement = 'bottom-end',
  dropdownStrategy = 'absolute',
  dropdownOffset = { x: 0, y: 0 },
  disableBlur = false,
  usePortal = false,
  onClickOutside,
  onClose,
  onOpen,
}: DropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownWidth,
    setDropdownPlacement,
  } = useDropdown(dropdownId);

  const offsetMiddlewares = [];

  const [dropdownMaxHeight, setDropdownMaxHeight] = useRecoilComponentStateV2(
    dropdownMaxHeightComponentStateV2,
    dropdownId,
  );

  if (isDefined(dropdownOffset.x)) {
    offsetMiddlewares.push(offset({ crossAxis: dropdownOffset.x }));
  }

  if (isDefined(dropdownOffset.y)) {
    offsetMiddlewares.push(offset({ mainAxis: dropdownOffset.y }));
  }

  const { refs, floatingStyles, placement } = useFloating({
    placement: dropdownPlacement,
    middleware: [
      flip(),
      size({
        padding: 32,
        apply: ({ availableHeight }) => {
          flushSync(() => {
            setDropdownMaxHeight(availableHeight);
          });
        },
        boundary: document.querySelector('#root') ?? undefined,
      }),
      ...offsetMiddlewares,
    ],
    whileElementsMounted: autoUpdate,
    strategy: dropdownStrategy,
  });

  useEffect(() => {
    setDropdownPlacement(placement);
  }, [placement, setDropdownPlacement]);

  const handleHotkeyTriggered = () => {
    toggleDropdown();
  };

  const handleClickableComponentClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    toggleDropdown();
    onClickOutside?.();
  };

  useListenClickOutside({
    refs: [refs.floating, refs.domReference],
    listenerId: dropdownId,
    callback: () => {
      onClickOutside?.();
      if (isDropdownOpen) {
        console.log(`Closing dropdown ${dropdownId} on click outside`);
        closeDropdown();
      }
    },
  });

  useInternalHotkeyScopeManagement({
    dropdownScopeId: getScopeIdFromComponentId(dropdownId),
    dropdownHotkeyScopeFromParent: dropdownHotkeyScope,
  });

  useScopedHotkeys(
    [Key.Escape],
    () => {
      if (isDropdownOpen) {
        closeDropdown();
      }
    },
    dropdownHotkeyScope.scope,
    [closeDropdown, isDropdownOpen],
  );

  const dropdownMenuStyles = {
    ...floatingStyles,
    maxHeight: dropdownMaxHeight,
  };

  return (
    <DropdownComponentInstanceContext.Provider
      value={{ instanceId: dropdownId }}
    >
      <DropdownScope dropdownScopeId={getScopeIdFromComponentId(dropdownId)}>
        <div ref={containerRef} className={className}>
          {clickableComponent && (
            <div
              ref={refs.setReference}
              onClick={handleClickableComponentClick}
              className={className}
            >
              {clickableComponent}
            </div>
          )}
          {hotkey && (
            <HotkeyEffect
              hotkey={hotkey}
              onHotkeyTriggered={handleHotkeyTriggered}
            />
          )}
          {isDropdownOpen && usePortal && (
            <FloatingPortal>
              <DropdownMenu
                disableBlur={disableBlur}
                width={dropdownMenuWidth ?? dropdownWidth}
                data-select-disable
                ref={refs.setFloating}
                style={dropdownMenuStyles}
              >
                {dropdownComponents}
              </DropdownMenu>
            </FloatingPortal>
          )}
          {isDropdownOpen && !usePortal && (
            <DropdownMenu
              disableBlur={disableBlur}
              width={dropdownMenuWidth ?? dropdownWidth}
              data-select-disable
              ref={refs.setFloating}
              style={dropdownMenuStyles}
            >
              {dropdownComponents}
            </DropdownMenu>
          )}
          <DropdownOnToggleEffect
            onDropdownClose={onClose}
            onDropdownOpen={onOpen}
          />
        </div>
      </DropdownScope>
      <DropdownUnmountEffect dropdownId={dropdownId} />
    </DropdownComponentInstanceContext.Provider>
  );
};
