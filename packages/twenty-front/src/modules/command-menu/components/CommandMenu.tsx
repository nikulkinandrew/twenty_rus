import { CommandGroup } from '@/command-menu/components/CommandGroup';
import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { CommandMenuTopBar } from '@/command-menu/components/CommandMenuTopBar';
import { COMMAND_MENU_SEARCH_BAR_HEIGHT } from '@/command-menu/constants/CommandMenuSearchBarHeight';
import { COMMAND_MENU_SEARCH_BAR_PADDING } from '@/command-menu/constants/CommandMenuSearchBarPadding';
import { useCommandMenu } from '@/command-menu/hooks/useCommandMenu';
import { useMatchingCommandMenuCommands } from '@/command-menu/hooks/useMatchingCommandMenuCommands';
import { commandMenuSearchState } from '@/command-menu/states/commandMenuSearchState';
import { SelectableItem } from '@/ui/layout/selectable-list/components/SelectableItem';
import { SelectableList } from '@/ui/layout/selectable-list/components/SelectableList';
import { AppHotkeyScope } from '@/ui/utilities/hotkey/types/AppHotkeyScope';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import styled from '@emotion/styled';
import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { isDefined } from 'twenty-ui';

const MOBILE_NAVIGATION_BAR_HEIGHT = 64;

type CommandGroupConfig = {
  heading: string;
  items?: any[];
};

const StyledCommandMenu = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-left: 1px solid ${({ theme }) => theme.border.color.medium};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  font-family: ${({ theme }) => theme.font.family};
  height: 100%;
  overflow: hidden;
  padding: 0;
  position: fixed;
  right: 0%;
  top: 0%;
  width: ${() => (useIsMobile() ? '100%' : '500px')};
  z-index: 1000;
`;

const StyledList = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  overscroll-behavior: contain;
  transition: 100ms ease;
  transition-property: height;
`;

const StyledInnerList = styled.div<{ isMobile: boolean }>`
  max-height: ${({ isMobile }) =>
    isMobile
      ? `calc(100dvh - ${COMMAND_MENU_SEARCH_BAR_HEIGHT}px - ${
          COMMAND_MENU_SEARCH_BAR_PADDING * 2
        }px - ${MOBILE_NAVIGATION_BAR_HEIGHT}px)`
      : `calc(100dvh - ${COMMAND_MENU_SEARCH_BAR_HEIGHT}px - ${
          COMMAND_MENU_SEARCH_BAR_PADDING * 2
        }px)`};
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  width: calc(100% - ${({ theme }) => theme.spacing(4)});
`;

const StyledEmpty = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.light};
  display: flex;
  font-size: ${({ theme }) => theme.font.size.md};
  height: 64px;
  justify-content: center;
  white-space: pre-wrap;
`;

export const CommandMenu = () => {
  const { onItemClick, closeCommandMenu } = useCommandMenu();
  const commandMenuRef = useRef<HTMLDivElement>(null);

  const [commandMenuSearch, setCommandMenuSearch] = useRecoilState(
    commandMenuSearchState,
  );

  const isMobile = useIsMobile();

  useListenClickOutside({
    refs: [commandMenuRef],
    callback: closeCommandMenu,
    listenerId: 'COMMAND_MENU_LISTENER_ID',
    hotkeyScope: AppHotkeyScope.CommandMenuOpen,
  });

  const {
    isNoResults,
    isLoading,
    copilotCommands,
    matchingStandardActionRecordSelectionCommands,
    matchingWorkflowRunRecordSelectionCommands,
    matchingStandardActionGlobalCommands,
    matchingWorkflowRunGlobalCommands,
    matchingNavigateCommand,
    peopleCommands,
    companyCommands,
    opportunityCommands,
    noteCommands,
    tasksCommands,
    customObjectCommands,
  } = useMatchingCommandMenuCommands({
    commandMenuSearch,
  });

  const selectableItems = copilotCommands
    .concat(matchingStandardActionRecordSelectionCommands)
    .concat(matchingWorkflowRunRecordSelectionCommands)
    .concat(matchingStandardActionGlobalCommands)
    .concat(matchingWorkflowRunGlobalCommands)
    .concat(matchingNavigateCommand)
    .concat(peopleCommands)
    .concat(companyCommands)
    .concat(opportunityCommands)
    .concat(noteCommands)
    .concat(tasksCommands)
    .concat(customObjectCommands)
    .filter(isDefined);

  const selectableItemIds = selectableItems.map((item) => item.id);

  const commandGroups: CommandGroupConfig[] = [
    {
      heading: 'Navigate',
      items: matchingNavigateCommand,
    },
    {
      heading: 'People',
      items: peopleCommands,
    },
    {
      heading: 'Companies',
      items: companyCommands,
    },
    {
      heading: 'Opportunities',
      items: opportunityCommands,
    },
    {
      heading: 'Notes',
      items: noteCommands,
    },
    {
      heading: 'Tasks',
      items: tasksCommands,
    },
    {
      heading: 'Custom Objects',
      items: customObjectCommands,
    },
  ];

  return (
    <>
      <StyledCommandMenu ref={commandMenuRef} className="command-menu">
        <CommandMenuTopBar
          commandMenuSearch={commandMenuSearch}
          setCommandMenuSearch={setCommandMenuSearch}
        />
        <StyledList>
          <ScrollWrapper
            contextProviderName="commandMenu"
            componentInstanceId={`scroll-wrapper-command-menu`}
          >
            <StyledInnerList isMobile={isMobile}>
              <SelectableList
                selectableListId="command-menu-list"
                selectableItemIdArray={selectableItemIds}
                hotkeyScope={AppHotkeyScope.CommandMenu}
                onEnter={(itemId) => {
                  const command = selectableItems.find(
                    (item) => item.id === itemId,
                  );

                  if (isDefined(command)) {
                    const {
                      to,
                      onCommandClick,
                      shouldCloseCommandMenuOnClick,
                    } = command;

                    onItemClick({
                      shouldCloseCommandMenuOnClick,
                      onClick: onCommandClick,
                      to,
                    });
                  }
                }}
              >
                {isNoResults && !isLoading && (
                  <StyledEmpty>No results found</StyledEmpty>
                )}
                {copilotCommands.length > 0 && (
                  <CommandGroup heading="Copilot">
                    {copilotCommands.map((copilotCommand) => (
                      <SelectableItem itemId={copilotCommand.id}>
                        <CommandMenuItem
                          id={copilotCommand.id}
                          Icon={copilotCommand.Icon}
                          label={`${copilotCommand.label} ${
                            commandMenuSearch.length > 2
                              ? `"${commandMenuSearch}"`
                              : ''
                          }`}
                          onClick={copilotCommand.onCommandClick}
                          firstHotKey={copilotCommand.firstHotKey}
                          secondHotKey={copilotCommand.secondHotKey}
                        />
                      </SelectableItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup heading="Record Selection">
                  {matchingStandardActionRecordSelectionCommands?.map(
                    (standardActionrecordSelectionCommand) => (
                      <SelectableItem
                        itemId={standardActionrecordSelectionCommand.id}
                        key={standardActionrecordSelectionCommand.id}
                      >
                        <CommandMenuItem
                          id={standardActionrecordSelectionCommand.id}
                          label={standardActionrecordSelectionCommand.label}
                          Icon={standardActionrecordSelectionCommand.Icon}
                          onClick={
                            standardActionrecordSelectionCommand.onCommandClick
                          }
                          firstHotKey={
                            standardActionrecordSelectionCommand.firstHotKey
                          }
                          secondHotKey={
                            standardActionrecordSelectionCommand.secondHotKey
                          }
                        />
                      </SelectableItem>
                    ),
                  )}
                  {matchingWorkflowRunRecordSelectionCommands?.map(
                    (workflowRunRecordSelectionCommand) => (
                      <SelectableItem
                        itemId={workflowRunRecordSelectionCommand.id}
                        key={workflowRunRecordSelectionCommand.id}
                      >
                        <CommandMenuItem
                          id={workflowRunRecordSelectionCommand.id}
                          label={workflowRunRecordSelectionCommand.label}
                          Icon={workflowRunRecordSelectionCommand.Icon}
                          onClick={
                            workflowRunRecordSelectionCommand.onCommandClick
                          }
                          firstHotKey={
                            workflowRunRecordSelectionCommand.firstHotKey
                          }
                          secondHotKey={
                            workflowRunRecordSelectionCommand.secondHotKey
                          }
                        />
                      </SelectableItem>
                    ),
                  )}
                </CommandGroup>
                {matchingStandardActionGlobalCommands?.length > 0 && (
                  <CommandGroup heading="View">
                    {matchingStandardActionGlobalCommands?.map(
                      (standardActionGlobalCommand) => (
                        <SelectableItem
                          itemId={standardActionGlobalCommand.id}
                          key={standardActionGlobalCommand.id}
                        >
                          <CommandMenuItem
                            id={standardActionGlobalCommand.id}
                            label={standardActionGlobalCommand.label}
                            Icon={standardActionGlobalCommand.Icon}
                            onClick={standardActionGlobalCommand.onCommandClick}
                            firstHotKey={
                              standardActionGlobalCommand.firstHotKey
                            }
                            secondHotKey={
                              standardActionGlobalCommand.secondHotKey
                            }
                          />
                        </SelectableItem>
                      ),
                    )}
                  </CommandGroup>
                )}
                {matchingWorkflowRunGlobalCommands?.length > 0 && (
                  <CommandGroup heading="Workflows">
                    {matchingWorkflowRunGlobalCommands?.map(
                      (workflowRunGlobalCommand) => (
                        <SelectableItem
                          itemId={workflowRunGlobalCommand.id}
                          key={workflowRunGlobalCommand.id}
                        >
                          <CommandMenuItem
                            id={workflowRunGlobalCommand.id}
                            label={workflowRunGlobalCommand.label}
                            Icon={workflowRunGlobalCommand.Icon}
                            onClick={workflowRunGlobalCommand.onCommandClick}
                            firstHotKey={workflowRunGlobalCommand.firstHotKey}
                            secondHotKey={workflowRunGlobalCommand.secondHotKey}
                            shouldCloseCommandMenuOnClick={
                              workflowRunGlobalCommand.shouldCloseCommandMenuOnClick
                            }
                          />
                        </SelectableItem>
                      ),
                    )}
                  </CommandGroup>
                )}

                {commandGroups.map(({ heading, items }) =>
                  items?.length ? (
                    <CommandGroup heading={heading} key={heading}>
                      {items.map((item) => {
                        return (
                          <SelectableItem itemId={item.id} key={item.id}>
                            <CommandMenuItem
                              key={item.id}
                              id={item.id}
                              Icon={item.Icon}
                              label={item.label}
                              to={item.to}
                              onClick={item.onClick}
                              firstHotKey={item.firstHotKey}
                              secondHotKey={item.secondHotKey}
                              shouldCloseCommandMenuOnClick={
                                item.shouldCloseCommandMenuOnClick
                              }
                            />
                          </SelectableItem>
                        );
                      })}
                    </CommandGroup>
                  ) : null,
                )}
              </SelectableList>
            </StyledInnerList>
          </ScrollWrapper>
        </StyledList>
      </StyledCommandMenu>
    </>
  );
};
