import { Injectable, Logger } from '@nestjs/common';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

import { GoogleAPIsRefreshAccessTokenService } from 'src/workspace/calendar-and-messaging/services/google-apis-refresh-access-token.service';
import { GmailFullSyncService } from 'src/workspace/messaging/services/gmail-full-sync.service';

export type GmailFullSyncJobData = {
  workspaceId: string;
  connectedAccountId: string;
  nextPageToken?: string;
};

@Injectable()
export class GmailFullSyncJob implements MessageQueueJob<GmailFullSyncJobData> {
  private readonly logger = new Logger(GmailFullSyncJob.name);

  constructor(
    private readonly googleAPIsRefreshAccessTokenService: GoogleAPIsRefreshAccessTokenService,
    private readonly gmailFullSyncService: GmailFullSyncService,
  ) {}

  async handle(data: GmailFullSyncJobData): Promise<void> {
    this.logger.log(
      `gmail full-sync for workspace ${data.workspaceId} and account ${
        data.connectedAccountId
      } ${data.nextPageToken ? `and ${data.nextPageToken} pageToken` : ''}`,
    );
    await this.googleAPIsRefreshAccessTokenService.refreshAndSaveAccessToken(
      data.workspaceId,
      data.connectedAccountId,
    );

    await this.gmailFullSyncService.fetchConnectedAccountThreads(
      data.workspaceId,
      data.connectedAccountId,
      data.nextPageToken,
    );
  }
}
