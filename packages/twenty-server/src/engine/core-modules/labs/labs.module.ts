import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureFlagEntity } from 'src/engine/core-modules/feature-flag/feature-flag.entity';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';

import { LabsResolver } from './labs.resolver';

import { LabsService } from './services/labs.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlagEntity, Workspace], 'core')],
  providers: [LabsService, LabsResolver],
  exports: [LabsService],
})
export class LabsModule {}
