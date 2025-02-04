import { useRecoilCallback, useRecoilValue } from 'recoil';

import { commandMenuSearchState } from '@/command-menu/states/commandMenuSearchState';
import { useSelectableList } from '@/ui/layout/selectable-list/hooks/useSelectableList';
import { usePreviousHotkeyScope } from '@/ui/utilities/hotkey/hooks/usePreviousHotkeyScope';
import { AppHotkeyScope } from '@/ui/utilities/hotkey/types/AppHotkeyScope';

import { useCopyContextStoreStates } from '@/command-menu/hooks/useCopyContextStoreAndActionMenuStates';
import { useResetContextStoreStates } from '@/command-menu/hooks/useResetContextStoreStates';
import {
  CommandMenuNavigationStackItem,
  commandMenuNavigationStackState,
} from '@/command-menu/states/commandMenuNavigationStackState';
import { commandMenuPageState } from '@/command-menu/states/commandMenuPageState';
import { commandMenuPageInfoState } from '@/command-menu/states/commandMenuPageTitle';
import { CommandMenuPages } from '@/command-menu/types/CommandMenuPages';
import { contextStoreCurrentViewTypeComponentState } from '@/context-store/states/contextStoreCurrentViewTypeComponentState';
import { contextStoreFiltersComponentState } from '@/context-store/states/contextStoreFiltersComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { mainContextStoreComponentInstanceIdState } from '@/context-store/states/mainContextStoreComponentInstanceId';
import { ContextStoreViewType } from '@/context-store/types/ContextStoreViewType';
import { viewableRecordIdState } from '@/object-record/record-right-drawer/states/viewableRecordIdState';
import { viewableRecordNameSingularState } from '@/object-record/record-right-drawer/states/viewableRecordNameSingularState';
import { emitRightDrawerCloseEvent } from '@/ui/layout/right-drawer/utils/emitRightDrawerCloseEvent';
import { IconSearch } from 'twenty-ui';
import { isCommandMenuOpenedState } from '../states/isCommandMenuOpenedState';

export const useCommandMenu = () => {
  const { resetSelectedItem } = useSelectableList('command-menu-list');
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const mainContextStoreComponentInstanceId = useRecoilValue(
    mainContextStoreComponentInstanceIdState,
  );

  const { copyContextStoreStates } = useCopyContextStoreStates();
  const { resetContextStoreStates } = useResetContextStoreStates();

  const openCommandMenu = useRecoilCallback(
    ({ set }) =>
      () => {
        copyContextStoreStates({
          instanceIdToCopyFrom: mainContextStoreComponentInstanceId,
          instanceIdToCopyTo: 'command-menu',
        });

        set(isCommandMenuOpenedState, true);
        setHotkeyScopeAndMemorizePreviousScope(AppHotkeyScope.CommandMenuOpen);
      },
    [
      copyContextStoreStates,
      mainContextStoreComponentInstanceId,
      setHotkeyScopeAndMemorizePreviousScope,
    ],
  );

  const closeCommandMenu = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const isCommandMenuOpened = snapshot
          .getLoadable(isCommandMenuOpenedState)
          .getValue();

        if (isCommandMenuOpened) {
          resetContextStoreStates('command-menu');
          resetContextStoreStates('command-menu-previous');

          set(viewableRecordIdState, null);
          set(commandMenuPageState, CommandMenuPages.Root);
          set(commandMenuPageInfoState, {
            title: undefined,
            Icon: undefined,
          });
          set(isCommandMenuOpenedState, false);
          set(commandMenuSearchState, '');
          set(commandMenuNavigationStackState, [
            { page: CommandMenuPages.Root },
          ]);
          resetSelectedItem();
          goBackToPreviousHotkeyScope();

          emitRightDrawerCloseEvent();
        }
      },
    [goBackToPreviousHotkeyScope, resetContextStoreStates, resetSelectedItem],
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

  const navigateCommandMenu = useRecoilCallback(
    ({ snapshot, set }) => {
      return ({
        page,
        pageTitle,
        pageIcon,
      }: CommandMenuNavigationStackItem) => {
        set(commandMenuPageState, page);
        set(commandMenuPageInfoState, {
          title: pageTitle,
          Icon: pageIcon,
        });

        const currentNavigationStack = snapshot
          .getLoadable(commandMenuNavigationStackState)
          .getValue();

        set(commandMenuNavigationStackState, [
          ...currentNavigationStack,
          { page, pageTitle, pageIcon },
        ]);
        openCommandMenu();
      };
    },
    [openCommandMenu],
  );

  const goBackFromCommandMenu = useRecoilCallback(
    ({ snapshot, set }) => {
      return () => {
        const currentNavigationStack = snapshot
          .getLoadable(commandMenuNavigationStackState)
          .getValue();

        const newNavigationStack = currentNavigationStack.slice(0, -1);

        if (newNavigationStack.length === 0) {
          closeCommandMenu();
        }

        const lastNavigationStackItem =
          newNavigationStack[newNavigationStack.length - 1];

        set(commandMenuPageState, lastNavigationStackItem?.page);

        set(commandMenuPageInfoState, {
          title: lastNavigationStackItem?.pageTitle,
          Icon: lastNavigationStackItem?.pageIcon,
        });

        set(commandMenuNavigationStackState, newNavigationStack);
      };
    },
    [closeCommandMenu],
  );

  const navigateCommandMenuHistory = useRecoilCallback(({ snapshot, set }) => {
    return (pageIndex: number) => {
      const currentNavigationStack = snapshot
        .getLoadable(commandMenuNavigationStackState)
        .getValue();

      const newNavigationStack = currentNavigationStack.slice(0, pageIndex);

      set(commandMenuNavigationStackState, newNavigationStack);

      if (newNavigationStack.length === 0) {
        throw new Error(
          `No command menu navigation stack item found for index ${pageIndex}`,
        );
      }

      const newNavigationStackItem =
        newNavigationStack[newNavigationStack.length - 1];

      set(commandMenuPageState, newNavigationStackItem?.page);
      set(commandMenuPageInfoState, {
        title: newNavigationStackItem?.pageTitle,
        Icon: newNavigationStackItem?.pageIcon,
      });
    };
  }, []);

  const openRecordInCommandMenu = useRecoilCallback(
    ({ set }) => {
      return (recordId: string, objectNameSingular: string) => {
        set(viewableRecordNameSingularState, objectNameSingular);
        set(viewableRecordIdState, recordId);
        navigateCommandMenu({
          page: CommandMenuPages.ViewRecord,
        });
      };
    },
    [navigateCommandMenu],
  );

  const openRecordsSearchPage = useRecoilCallback(() => {
    return () => {
      navigateCommandMenu({
        page: CommandMenuPages.SearchRecords,
        pageTitle: 'Search records',
        pageIcon: IconSearch,
      });
    };
  }, [navigateCommandMenu]);

  const setGlobalCommandMenuContext = useRecoilCallback(
    ({ set }) => {
      return () => {
        copyContextStoreStates({
          instanceIdToCopyFrom: 'command-menu',
          instanceIdToCopyTo: 'command-menu-previous',
        });

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
          contextStoreCurrentViewTypeComponentState.atomFamily({
            instanceId: 'command-menu',
          }),
          ContextStoreViewType.Table,
        );

        set(commandMenuPageInfoState, {
          title: undefined,
          Icon: undefined,
        });
      };
    },
    [copyContextStoreStates],
  );

  return {
    openCommandMenu,
    closeCommandMenu,
    navigateCommandMenu,
    navigateCommandMenuHistory,
    goBackFromCommandMenu,
    openRecordsSearchPage,
    openRecordInCommandMenu,
    toggleCommandMenu,
    setGlobalCommandMenuContext,
  };
};
