import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/integrations/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/integrations/message-queue/services/message-queue.service';
import { MessagingMessagesImportCronJob } from 'src/modules/messaging/message-import-manager/crons/jobs/messaging-messages-import.cron.job';

const MESSAGING_MESSAGE_IMPORT_CRON_PATTERN = '*/1 * * * *';

@Command({
  name: 'cron:messaging:messages-import',
  description: 'Starts a cron job to fetch all messages from cache',
})
export class MessagingMessagesImportCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>(
      MessagingMessagesImportCronJob.name,
      undefined,
      {
        repeat: {
          pattern: MESSAGING_MESSAGE_IMPORT_CRON_PATTERN,
        },
      },
    );
  }
}
