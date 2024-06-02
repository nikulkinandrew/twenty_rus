import { CalendarChannelEventAssociationRepository } from 'src/modules/calendar/repositories/calendar-channel-event-association.repository';
import { CalendarChannelRepository } from 'src/modules/calendar/repositories/calendar-channel.repository';
import { CalendarEventParticipantRepository } from 'src/modules/calendar/repositories/calendar-event-participant.repository';
import { CalendarEventRepository } from 'src/modules/calendar/repositories/calendar-event.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { BlocklistRepository } from 'src/modules/connected-account/repositories/blocklist.repository';
import { ConnectedAccountRepository } from 'src/modules/connected-account/repositories/connected-account.repository';
import { AuditLogRepository } from 'src/modules/timeline/repositiories/audit-log.repository';
import { TimelineActivityRepository } from 'src/modules/timeline/repositiories/timeline-activity.repository';
import { MessageChannelMessageAssociationRepository } from 'src/modules/messaging/repositories/message-channel-message-association.repository';
import { MessageChannelRepository } from 'src/modules/messaging/repositories/message-channel.repository';
import { MessageParticipantRepository } from 'src/modules/messaging/message-participant/repositories/message-participant.repository';
import { MessageThreadRepository } from 'src/modules/messaging/repositories/message-thread.repository';
import { MessageRepository } from 'src/modules/messaging/repositories/message.repository';
import { PersonRepository } from 'src/modules/person/repositories/person.repository';
import { WorkspaceMemberRepository } from 'src/modules/workspace-member/repositories/workspace-member.repository';
import { AttachmentRepository } from 'src/modules/attachment/repositories/attachment.repository';
import { CommentRepository } from 'src/modules/activity/repositories/comment.repository';

export const metadataToRepositoryMapping = {
  AuditLogWorkspaceEntity: AuditLogRepository,
  BlocklistWorkspaceEntity: BlocklistRepository,
  CalendarChannelEventAssociationWorkspaceEntity:
    CalendarChannelEventAssociationRepository,
  CalendarChannelWorkspaceEntity: CalendarChannelRepository,
  CalendarEventParticipantWorkspaceEntity: CalendarEventParticipantRepository,
  CalendarEventWorkspaceEntity: CalendarEventRepository,
  CompanyWorkspaceEntity: CompanyRepository,
  ConnectedAccountWorkspaceEntity: ConnectedAccountRepository,
  MessageChannelMessageAssociationWorkspaceEntity:
    MessageChannelMessageAssociationRepository,
  MessageChannelWorkspaceEntity: MessageChannelRepository,
  MessageWorkspaceEntity: MessageRepository,
  MessageParticipantWorkspaceEntity: MessageParticipantRepository,
  MessageThreadWorkspaceEntity: MessageThreadRepository,
  PersonWorkspaceEntity: PersonRepository,
  TimelineActivityWorkspaceEntity: TimelineActivityRepository,
  WorkspaceMemberWorkspaceEntity: WorkspaceMemberRepository,
  AttachmentWorkspaceEntity: AttachmentRepository,
  CommentWorkspaceEntity: CommentRepository,
};
