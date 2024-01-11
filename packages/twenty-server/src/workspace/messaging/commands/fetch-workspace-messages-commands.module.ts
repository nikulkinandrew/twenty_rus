import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureFlagEntity } from 'src/core/feature-flag/feature-flag.entity';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { DataSourceModule } from 'src/metadata/data-source/data-source.module';
import { GmailFullSyncCommand } from 'src/workspace/messaging/commands/gmail-full-sync.command';
import { MessagingModule } from 'src/workspace/messaging/messaging.module';

@Module({
  imports: [
    MessagingModule,
    DataSourceModule,
    TypeORMModule,
    TypeOrmModule.forFeature([FeatureFlagEntity], 'core'),
  ],
  providers: [GmailFullSyncCommand],
})
export class FetchWorkspaceMessagesCommandsModule {}
