import { Command, CommandRunner } from 'nest-commander';

import { seedCoreSchema } from 'src/database/typeorm-seeds/core';
import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_TWENTY_WORKSPACE_ID,
} from 'src/database/typeorm-seeds/core/workspaces';
import { rawDataSource } from 'src/database/typeorm/raw/raw.datasource';
import { TypeORMService } from 'src/database/typeorm/typeorm.service';
import { CacheStorageService } from 'src/engine/integrations/cache-storage/cache-storage.service';
import { InjectCacheStorage } from 'src/engine/integrations/cache-storage/decorators/cache-storage.decorator';
import { CacheStorageNamespace } from 'src/engine/integrations/cache-storage/types/cache-storage-namespace.enum';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { WorkspaceSyncMetadataService } from 'src/engine/workspace-manager/workspace-sync-metadata/workspace-sync-metadata.service';

// TODO: implement dry-run
@Command({
  name: 'workspace:seed:dev',
  description:
    'Seed workspace with initial data. This command is intended for development only.',
})
export class DataSeedWorkspaceCommand extends CommandRunner {
  workspaceIds = [SEED_APPLE_WORKSPACE_ID, SEED_TWENTY_WORKSPACE_ID];

  constructor(
    private readonly dataSourceService: DataSourceService,
    private readonly typeORMService: TypeORMService,
    private readonly workspaceSyncMetadataService: WorkspaceSyncMetadataService,
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly objectMetadataService: ObjectMetadataService,
    @InjectCacheStorage(CacheStorageNamespace.WorkspaceSchema)
    private readonly workspaceSchemaCache: CacheStorageService,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      for (const workspaceId of this.workspaceIds) {
        await this.workspaceSchemaCache.flush();

        await rawDataSource.initialize();

        await seedCoreSchema(rawDataSource, workspaceId);

        await rawDataSource.destroy();

        const schemaName =
          await this.workspaceDataSourceService.createWorkspaceDBSchema(
            workspaceId,
          );

        const dataSourceMetadata =
          await this.dataSourceService.createDataSourceMetadata(
            workspaceId,
            schemaName,
          );

        await this.workspaceSyncMetadataService.synchronize({
          workspaceId: workspaceId,
          dataSourceId: dataSourceMetadata.id,
        });
      }
    } catch (error) {
      console.error(error);

      return;
    }

    for (const workspaceId of this.workspaceIds) {
      const dataSourceMetadata =
        await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
          workspaceId,
        );

      const workspaceDataSource =
        await this.typeORMService.connectToDataSource(dataSourceMetadata);

      if (!workspaceDataSource) {
        throw new Error('Could not connect to workspace data source');
      }

      try {
        const objectMetadata =
          await this.objectMetadataService.findManyWithinWorkspace(workspaceId);
        const objectMetadataMap = objectMetadata.reduce((acc, object) => {
          acc[object.standardId ?? ''] = {
            id: object.id,
            fields: object.fields.reduce((acc, field) => {
              acc[field.standardId ?? ''] = field.id;

              return acc;
            }, {}),
          };

          return acc;
        }, {});

        // await workspaceDataSource.transaction(
        //   async (entityManager: EntityManager) => {
        //     await seedCompanies(entityManager, dataSourceMetadata.schema);
        //     await seedPeople(entityManager, dataSourceMetadata.schema);
        //     await seedOpportunity(entityManager, dataSourceMetadata.schema);
        //     await seedWorkspaceMember(
        //       entityManager,
        //       dataSourceMetadata.schema,
        //       workspaceId,
        //     );
        //     await workflowPrefillData(entityManager, dataSourceMetadata.schema);

        //     if (workspaceId === SEED_APPLE_WORKSPACE_ID) {
        //       await seedMessageThread(entityManager, dataSourceMetadata.schema);
        //       await seedConnectedAccount(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedMessage(entityManager, dataSourceMetadata.schema);
        //       await seedMessageChannel(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedMessageChannelMessageAssociation(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedMessageParticipant(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );

        //       await seedCalendarEvents(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedCalendarChannels(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedCalendarChannelEventAssociations(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //       await seedCalendarEventParticipants(
        //         entityManager,
        //         dataSourceMetadata.schema,
        //       );
        //     }

        //     await viewPrefillData(
        //       entityManager,
        //       dataSourceMetadata.schema,
        //       objectMetadataMap,
        //     );
        //   },
        // );
      } catch (error) {
        console.error(error);
      }

      await this.typeORMService.disconnectFromDataSource(dataSourceMetadata.id);
    }
  }
}
