import { isNonEmptyString } from '@sniptt/guards';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';

import { commandMenuSearchState } from '@/command-menu/states/commandMenuSearchState';
import { useSelectableList } from '@/ui/layout/selectable-list/hooks/useSelectableList';
import { usePreviousHotkeyScope } from '@/ui/utilities/hotkey/hooks/usePreviousHotkeyScope';
import { AppHotkeyScope } from '@/ui/utilities/hotkey/types/AppHotkeyScope';
import { isDefined } from '~/utils/isDefined';

import { contextStoreCurrentObjectMetadataIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataIdComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreCurrentViewTypeComponentState } from '@/context-store/states/contextStoreCurrentViewTypeComponentState';
import { contextStoreFiltersComponentState } from '@/context-store/states/contextStoreFiltersComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { mainContextStoreComponentInstanceIdState } from '@/context-store/states/mainContextStoreComponentInstanceId';
import { isCommandMenuOpenedState } from '../states/isCommandMenuOpenedState';

export const useCommandMenu = () => {
  const navigate = useNavigate();
  const setIsCommandMenuOpened = useSetRecoilState(isCommandMenuOpenedState);
  const { resetSelectedItem } = useSelectableList('command-menu-list');
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const mainContextStoreComponentInstanceId = useRecoilValue(
    mainContextStoreComponentInstanceIdState,
  );

  const openCommandMenu = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        if (isDefined(mainContextStoreComponentInstanceId)) {
          const contextStoreCurrentObjectMetadataId = snapshot
            .getLoadable(
              contextStoreCurrentObjectMetadataIdComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreCurrentObjectMetadataIdComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreCurrentObjectMetadataId,
          );

          const contextStoreTargetedRecordsRule = snapshot
            .getLoadable(
              contextStoreTargetedRecordsRuleComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreTargetedRecordsRuleComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreTargetedRecordsRule,
          );

          const contextStoreNumberOfSelectedRecords = snapshot
            .getLoadable(
              contextStoreNumberOfSelectedRecordsComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreNumberOfSelectedRecordsComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreNumberOfSelectedRecords,
          );

          const contextStoreFilters = snapshot
            .getLoadable(
              contextStoreFiltersComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreFiltersComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreFilters,
          );

          const contextStoreCurrentViewId = snapshot
            .getLoadable(
              contextStoreCurrentViewIdComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreCurrentViewIdComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreCurrentViewId,
          );

          const contextStoreCurrentViewType = snapshot
            .getLoadable(
              contextStoreCurrentViewTypeComponentState.atomFamily({
                instanceId: mainContextStoreComponentInstanceId,
              }),
            )
            .getValue();

          set(
            contextStoreCurrentViewTypeComponentState.atomFamily({
              instanceId: 'command-menu',
            }),
            contextStoreCurrentViewType,
          );
        }

        setIsCommandMenuOpened(true);
        setHotkeyScopeAndMemorizePreviousScope(AppHotkeyScope.CommandMenuOpen);
      },
    [
      mainContextStoreComponentInstanceId,
      setHotkeyScopeAndMemorizePreviousScope,
      setIsCommandMenuOpened,
    ],
  );

  const closeCommandMenu = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const isCommandMenuOpened = snapshot
          .getLoadable(isCommandMenuOpenedState)
          .getValue();

        set(
          contextStoreCurrentObjectMetadataIdComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          null,
        );

        set(
          contextStoreTargetedRecordsRuleComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          {
            mode: 'selection',
            selectedRecordIds: [],
          },
        );

        set(
          contextStoreNumberOfSelectedRecordsComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          0,
        );

        set(
          contextStoreFiltersComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          [],
        );

        set(
          contextStoreCurrentViewIdComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          null,
        );

        set(
          contextStoreCurrentViewTypeComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          null,
        );

        if (isCommandMenuOpened) {
          setIsCommandMenuOpened(false);
          resetSelectedItem();
          goBackToPreviousHotkeyScope();
        }
      },
    [goBackToPreviousHotkeyScope, resetSelectedItem, setIsCommandMenuOpened],
  );

  const toggleCommandMenu = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const isCommandMenuOpened = snapshot
          .getLoadable(isCommandMenuOpenedState)
          .getValue();

        set(commandMenuSearchState, '');

        if (isCommandMenuOpened) {
          closeCommandMenu();
        } else {
          openCommandMenu();
        }
      },
    [closeCommandMenu, openCommandMenu],
  );

  const onItemClick = useCallback(
    ({
      shouldCloseCommandMenuOnClick,
      onClick,
      to,
    }: {
      shouldCloseCommandMenuOnClick?: boolean;
      onClick?: () => void;
      to?: string;
    }) => {
      if (
        isDefined(shouldCloseCommandMenuOnClick) &&
        shouldCloseCommandMenuOnClick
      ) {
        toggleCommandMenu();
      }

      if (isDefined(onClick)) {
        onClick();
        return;
      }
      if (isNonEmptyString(to)) {
        navigate(to);
        return;
      }
    },
    [navigate, toggleCommandMenu],
  );

  return {
    openCommandMenu,
    closeCommandMenu,
    toggleCommandMenu,
    onItemClick,
  };
};
