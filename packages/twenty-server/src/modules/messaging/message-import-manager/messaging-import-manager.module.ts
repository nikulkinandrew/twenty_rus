import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceEntity } from 'src/engine/metadata-modules/data-source/data-source.entity';
import { MessagingCommonModule } from 'src/modules/messaging/common/messaging-common.module';
import { MessagingSingleMessageImportCommand } from 'src/modules/messaging/message-import-manager/commands/messaging-single-message-import.command';
import { MessagingMessageListFetchCronCommand } from 'src/modules/messaging/message-import-manager/crons/commands/messaging-message-list-fetch.cron.command';
import { MessagingMessagesImportCronCommand } from 'src/modules/messaging/message-import-manager/crons/commands/messaging-messages-import.cron.command';
import { MessagingMessageListFetchCronJob } from 'src/modules/messaging/message-import-manager/crons/jobs/messaging-message-list-fetch.cron.job';
import { MessagingMessagesImportCronJob } from 'src/modules/messaging/message-import-manager/crons/jobs/messaging-messages-import.cron.job';
import { MessagingGmailDriverModule } from 'src/modules/messaging/message-import-manager/drivers/gmail/messaging-gmail-driver.module';
import { MessagingAddSingleMessageToCacheForImportJob } from 'src/modules/messaging/message-import-manager/jobs/messaging-add-single-message-to-cache-for-import.job';
import { MessagingMessageListFetchJob } from 'src/modules/messaging/message-import-manager/jobs/messaging-message-list-fetch.job';
import { MessagingMessagesImportJob } from 'src/modules/messaging/message-import-manager/jobs/messaging-messages-import.job';

@Module({
  imports: [
    MessagingGmailDriverModule,
    MessagingCommonModule,
    TypeOrmModule.forFeature([Workspace], 'core'),
    TypeOrmModule.forFeature([DataSourceEntity], 'metadata'),
  ],
  providers: [
    MessagingMessageListFetchCronCommand,
    MessagingMessagesImportCronCommand,
    MessagingSingleMessageImportCommand,
    MessagingMessageListFetchJob,
    MessagingMessagesImportJob,
    MessagingMessageListFetchCronJob,
    MessagingMessagesImportCronJob,
    MessagingAddSingleMessageToCacheForImportJob,
  ],
  exports: [],
})
export class MessagingImportManagerModule {}
