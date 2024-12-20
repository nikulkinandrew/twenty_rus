import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { Repository } from 'typeorm';

import { ActiveWorkspacesCommandRunner } from 'src/database/commands/active-workspaces.command';
import { BaseCommandOptions } from 'src/database/commands/base.command';
import { PhoneCallingCodeCreateColumnCommand } from 'src/database/commands/upgrade-version/0-35/0-35-phone-calling-code-create-column.command';
import { RecordPositionBackfillCommand } from 'src/database/commands/upgrade-version/0-35/0-35-record-position-backfill.command';
import { ViewGroupNoValueBackfillCommand } from 'src/database/commands/upgrade-version/0-35/0-35-view-group-no-value-backfill.command';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { SyncWorkspaceMetadataCommand } from 'src/engine/workspace-manager/workspace-sync-metadata/commands/sync-workspace-metadata.command';

@Command({
  name: 'upgrade-0.35',
  description: 'Upgrade to 0.35',
})
export class UpgradeTo0_35Command extends ActiveWorkspacesCommandRunner {
  constructor(
    @InjectRepository(Workspace, 'core')
    protected readonly workspaceRepository: Repository<Workspace>,
    private readonly viewGroupNoValueBackfillCommand: ViewGroupNoValueBackfillCommand,
    private readonly syncWorkspaceMetadataCommand: SyncWorkspaceMetadataCommand,
    private readonly phoneCallingCodeCreateColumnCommand: PhoneCallingCodeCreateColumnCommand,
    private readonly recordPositionBackfillCommand: RecordPositionBackfillCommand,
  ) {
    super(workspaceRepository);
  }

  async executeActiveWorkspacesCommand(
    passedParam: string[],
    options: BaseCommandOptions,
    workspaceIds: string[],
  ): Promise<void> {
    await this.recordPositionBackfillCommand.executeActiveWorkspacesCommand(
      passedParam,
      options,
      workspaceIds,
    );

    await this.phoneCallingCodeCreateColumnCommand.executeActiveWorkspacesCommand(
      passedParam,
      options,
      workspaceIds,
    );

    await this.viewGroupNoValueBackfillCommand.executeActiveWorkspacesCommand(
      passedParam,
      options,
      workspaceIds,
    );

    await this.syncWorkspaceMetadataCommand.executeActiveWorkspacesCommand(
      passedParam,
      {
        ...options,
        force: true,
      },
      workspaceIds,
    );
  }
}
