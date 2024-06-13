import { getDomainNameFromHandle } from 'src/modules/calendar-messaging-participant/utils/get-domain-name-from-handle.util';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { ObjectRecord } from 'src/engine/workspace-manager/workspace-sync-metadata/types/object-record';
import { Contacts } from 'src/modules/connected-account/auto-companies-and-contacts-creation/types/contact.type';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';

export function filterOutSelfAndContactsFromCompanyOrWorkspace(
  contacts: Contacts,
  connectedAccount: ObjectRecord<ConnectedAccountWorkspaceEntity>,
  workspaceMembers: ObjectRecord<WorkspaceMemberWorkspaceEntity>[],
): Contacts {
  const selfDomainName = getDomainNameFromHandle(connectedAccount.handle);

  const emailAliases = connectedAccount.emailAliases?.split(',') || [];

  const workspaceMembersMap = workspaceMembers.reduce(
    (map, workspaceMember) => {
      map[workspaceMember.userEmail] = true;

      return map;
    },
    new Map<string, boolean>(),
  );

  return contacts.filter(
    (contact) =>
      getDomainNameFromHandle(contact.handle) !== selfDomainName &&
      !workspaceMembersMap[contact.handle] &&
      !emailAliases.includes(contact.handle),
  );
}
