import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';

import { TypeDefinitionsGenerator } from './type-definitions.generator';
import { WorkspaceGraphQLSchemaFactory } from './workspace-graphql-schema.factory';

import { workspaceSchemaBuilderFactories } from './factories/factories';
import { TypeMapperService } from './services/type-mapper.service';
import { TypeDefinitionsStorage } from './storages/type-definitions.storage';

@Module({
  imports: [ObjectMetadataModule, FeatureFlagModule],
  providers: [
    TypeDefinitionsStorage,
    TypeMapperService,
    ...workspaceSchemaBuilderFactories,
    TypeDefinitionsGenerator,
    WorkspaceGraphQLSchemaFactory,
  ],
  exports: [WorkspaceGraphQLSchemaFactory],
})
export class WorkspaceSchemaBuilderModule {}
