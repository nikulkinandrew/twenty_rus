import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { StorageDriverType } from 'src/engine/integrations/file-storage/interfaces';

@Injectable()
export class AttachmentRepository {
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
  ) {}

  public async insert({
    id,
    messageId,
    name,
    personId,
    storageDriverType,
    type,
    workspaceId,
    transactionManager,
  }: {
    id: string;
    workspaceId: string;
    personId: string | null;
    messageId: string;
    storageDriverType: StorageDriverType;
    name: string;
    type: string;
    transactionManager?: EntityManager;
  }): Promise<void> {
    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    await this.workspaceDataSourceService.executeRawQuery(
      `INSERT INTO ${dataSourceSchema}."attachment" ("id", "personId", "messageId", "storageDriverType", "name", "type") VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, personId, messageId, storageDriverType, name, type],
      workspaceId,
      transactionManager,
    );
  }
}
