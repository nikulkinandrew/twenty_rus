import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordUpdateEvent } from 'src/engine/integrations/event-emitter/types/object-record-update.event';
import { objectRecordChangedProperties } from 'src/engine/integrations/event-emitter/utils/object-record-changed-properties.util';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/integrations/message-queue/services/message-queue.service';
import {
  MessagingCreateCompanyAndContactAfterSyncJobData,
  MessagingCreateCompanyAndContactAfterSyncJob,
} from 'src/modules/messaging/jobs/messaging-create-company-and-contact-after-sync.job';
import { MessageChannelWorkspaceEntity } from 'src/modules/messaging/standard-objects/message-channel.workspace-entity';

@Injectable()
export class MessagingMessageChannelListener {
  constructor(
    @Inject(MessageQueue.messagingQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('messageChannel.updated')
  async handleUpdatedEvent(
    payload: ObjectRecordUpdateEvent<MessageChannelWorkspaceEntity>,
  ) {
    if (
      objectRecordChangedProperties(
        payload.properties.before,
        payload.properties.after,
      ).includes('isContactAutoCreationEnabled') &&
      payload.properties.after.isContactAutoCreationEnabled
    ) {
      await this.messageQueueService.add<MessagingCreateCompanyAndContactAfterSyncJobData>(
        MessagingCreateCompanyAndContactAfterSyncJob.name,
        {
          workspaceId: payload.workspaceId,
          messageChannelId: payload.recordId,
        },
      );
    }
  }
}
