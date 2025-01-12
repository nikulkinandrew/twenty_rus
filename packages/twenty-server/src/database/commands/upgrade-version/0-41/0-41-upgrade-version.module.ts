import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MigrateRichTextFieldCommand } from 'src/database/commands/upgrade-version/0-41/0-41-migrate-rich-text-field.command';
import { UpgradeTo0_41Command } from 'src/database/commands/upgrade-version/0-41/0-41-upgrade-version.command';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { WorkspaceMetadataVersionModule } from 'src/engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module';
import { WorkspaceMigrationModule } from 'src/engine/metadata-modules/workspace-migration/workspace-migration.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration-runner/workspace-migration-runner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace], 'core'),
    TypeOrmModule.forFeature(
      [ObjectMetadataEntity, FieldMetadataEntity],
      'metadata',
    ),
    WorkspaceMigrationRunnerModule,
    WorkspaceMigrationModule,
    WorkspaceMetadataVersionModule,
    WorkspaceDataSourceModule,
  ],
  providers: [UpgradeTo0_41Command, MigrateRichTextFieldCommand],
})
export class UpgradeTo0_41CommandModule {}
