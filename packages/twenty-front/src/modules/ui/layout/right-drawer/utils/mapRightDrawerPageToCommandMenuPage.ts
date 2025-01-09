import { CommandMenuPages } from '@/command-menu/components/CommandMenuPages';
import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';

export const mapRightDrawerPageToCommandMenuPage = (
  rightDrawerPage: RightDrawerPages,
) => {
  switch (rightDrawerPage) {
    case RightDrawerPages.ViewRecord:
      return CommandMenuPages.ViewRecord;
    case RightDrawerPages.ViewEmailThread:
      return CommandMenuPages.ViewEmailThread;
    case RightDrawerPages.ViewCalendarEvent:
      return CommandMenuPages.ViewCalendarEvent;
    case RightDrawerPages.Copilot:
      return CommandMenuPages.Copilot;
    default:
      return CommandMenuPages.Root;
  }
};
