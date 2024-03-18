import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { v4 } from 'uuid';

import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { DataSourceEntity } from 'src/engine-metadata/data-source/data-source.entity';
import { MessageChannelMessageAssociationRepository } from 'src/modules/messaging/repositories/message-channel-message-association/message-channel-message-association.repository';
import { MessageRepository } from 'src/modules/messaging/repositories/message/message.repository';
import { InjectObjectMetadataRepository } from 'src/engine/object-metadata-repository.decorator';
import { MessageChannelMessageAssociationObjectMetadata } from 'src/modules/messaging/standard-objects/message-channel-message-association.object-metadata';

@Injectable()
export class MessageThreadRepository {
  constructor(
    @InjectObjectMetadataRepository(
      MessageChannelMessageAssociationObjectMetadata,
    )
    private readonly messageChannelMessageAssociationService: MessageChannelMessageAssociationRepository,
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    @Inject(forwardRef(() => MessageRepository))
    private readonly messageService: MessageRepository,
  ) {}

  public async getOrphanThreadIdsPaginated(
    limit: number,
    offset: number,
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const orphanThreads = await this.workspaceDataSourceService.executeRawQuery(
      `SELECT mt.id
      FROM ${dataSourceSchema}."messageThread" mt
      LEFT JOIN ${dataSourceSchema}."message" m ON mt.id = m."messageThreadId"
      WHERE m."messageThreadId" IS NULL
      LIMIT $1 OFFSET $2`,
      [limit, offset],
      workspaceId,
      transactionManager,
    );

    return orphanThreads.map(({ id }) => id);
  }

  public async deleteByIds(
    messageThreadIds: string[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    await this.workspaceDataSourceService.executeRawQuery(
      `DELETE FROM ${dataSourceSchema}."messageThread" WHERE id = ANY($1)`,
      [messageThreadIds],
      workspaceId,
      transactionManager,
    );
  }

  public async saveMessageThreadOrReturnExistingMessageThread(
    headerMessageId: string,
    messageThreadExternalId: string,
    dataSourceMetadata: DataSourceEntity,
    workspaceId: string,
    manager: EntityManager,
  ) {
    // Check if message thread already exists via threadExternalId
    const existingMessageChannelMessageAssociationByMessageThreadExternalId =
      await this.messageChannelMessageAssociationService.getFirstByMessageThreadExternalId(
        messageThreadExternalId,
        workspaceId,
        manager,
      );

    const existingMessageThread =
      existingMessageChannelMessageAssociationByMessageThreadExternalId?.messageThreadId;

    if (existingMessageThread) {
      return Promise.resolve(existingMessageThread);
    }

    // Check if message thread already exists via existing message headerMessageId
    const existingMessageWithSameHeaderMessageId =
      await this.messageService.getFirstOrNullByHeaderMessageId(
        headerMessageId,
        workspaceId,
        manager,
      );

    if (existingMessageWithSameHeaderMessageId) {
      return Promise.resolve(
        existingMessageWithSameHeaderMessageId.messageThreadId,
      );
    }

    // If message thread does not exist, create new message thread
    const newMessageThreadId = v4();

    await manager.query(
      `INSERT INTO ${dataSourceMetadata.schema}."messageThread" ("id") VALUES ($1)`,
      [newMessageThreadId],
    );

    return Promise.resolve(newMessageThreadId);
  }
}
