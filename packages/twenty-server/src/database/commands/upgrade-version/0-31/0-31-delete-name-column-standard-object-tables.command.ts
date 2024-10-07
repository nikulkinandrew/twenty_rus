import { InjectRepository } from '@nestjs/typeorm';

import chalk from 'chalk';
import { Command } from 'nest-commander';
import { Repository } from 'typeorm';

import {
  ActiveWorkspacesCommandOptions,
  ActiveWorkspacesCommandRunner,
} from 'src/database/commands/active-workspaces.command';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';

@Command({
  name: 'upgrade-0.31:delete-name-column-standard-object-tables',
  description: 'Delete name column from standard object tables',
})
export class DeleteNameColumnStandardObjectTablesCommand extends ActiveWorkspacesCommandRunner {
  constructor(
    @InjectRepository(Workspace, 'core')
    protected readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(ObjectMetadataEntity, 'metadata')
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {
    super(workspaceRepository);
  }

  async executeActiveWorkspacesCommand(
    _passedParam: string[],
    options: ActiveWorkspacesCommandOptions,
    workspaceIds: string[],
  ): Promise<void> {
    this.logger.log('Running command to fix migration');

    for (const workspaceId of workspaceIds) {
      this.logger.log(`Running command for workspace ${workspaceId}`);

      try {
        this.logger.log(
          chalk.green(`Deleting name columns from workspace ${workspaceId}.`),
        );

        const standardObjects = await this.objectMetadataRepository.find({
          where: {
            isCustom: false,
            workspaceId,
          },
        });

        const dataSource =
          await this.twentyORMGlobalManager.getDataSourceForWorkspace(
            workspaceId,
          );

        for (const standardObject of standardObjects) {
          if (options.dryRun) {
            this.logger.log(
              chalk.yellow(
                `Dry run mode enabled. Skipping deletion of name column for workspace ${workspaceId} and table ${standardObject.nameSingular}.`,
              ),
            );
            continue;
          }

          await dataSource.query(
            `ALTER TABLE "${standardObject.nameSingular}" DROP COLUMN IF EXISTS "name"`,
          );
        }
      } catch (error) {
        this.logger.log(
          chalk.red(
            `Running command on workspace ${workspaceId} failed with error: ${error}`,
          ),
        );
        continue;
      } finally {
        this.logger.log(
          chalk.green(`Finished running command for workspace ${workspaceId}.`),
        );
      }
    }
  }
}
