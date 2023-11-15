import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Equal, In, Repository } from 'typeorm';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';

import { TenantMigrationService } from 'src/metadata/tenant-migration/tenant-migration.service';
import { TenantMigrationRunnerService } from 'src/tenant-migration-runner/tenant-migration-runner.service';
import { TenantMigrationTableAction } from 'src/metadata/tenant-migration/tenant-migration.entity';
import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';

import { ObjectMetadataEntity } from './object-metadata.entity';

import { CreateObjectInput } from './dtos/create-object.input';

@Injectable()
export class ObjectMetadataService extends TypeOrmQueryService<ObjectMetadataEntity> {
  constructor(
    @InjectRepository(ObjectMetadataEntity, 'metadata')
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,

    private readonly tenantMigrationService: TenantMigrationService,
    private readonly migrationRunnerService: TenantMigrationRunnerService,
  ) {
    super(objectMetadataRepository);
  }

  override async deleteOne(id: string): Promise<ObjectMetadataEntity> {
    const objectMetadata = await this.objectMetadataRepository.findOne({
      where: { id },
    });

    if (!objectMetadata) {
      throw new NotFoundException('Object does not exist');
    }

    if (!objectMetadata.isCustom) {
      throw new BadRequestException("Standard Objects can't be deleted");
    }

    if (objectMetadata.isActive) {
      throw new BadRequestException("Active objects can't be deleted");
    }

    return super.deleteOne(id);
  }

  override async createOne(
    record: CreateObjectInput,
  ): Promise<ObjectMetadataEntity> {
    const createdObjectMetadata = await super.createOne({
      ...record,
      targetTableName: `_${record.nameSingular}`,
      isActive: true,
      isCustom: true,
      isSystem: false,
      fields:
        // Creating default fields.
        // No need to create a custom migration for this though as the default columns are already
        // created with default values which is not supported yet by tenant migrations.
        [
          {
            type: FieldMetadataType.UUID,
            name: 'id',
            label: 'Id',
            targetColumnMap: {
              value: 'id',
            },
            icon: undefined,
            description: 'Id',
            isNullable: false,
            isActive: true,
            isCustom: false,
            // isSystem: true,
            workspaceId: record.workspaceId,
          },
          {
            type: FieldMetadataType.DATE,
            name: 'createdAt',
            label: 'Creation date',
            targetColumnMap: {
              value: 'createdAt',
            },
            icon: 'IconCalendar',
            description: 'Creation date',
            isNullable: false,
            isActive: true,
            isCustom: false,
            workspaceId: record.workspaceId,
          },
          {
            type: FieldMetadataType.DATE,
            name: 'updatedAt',
            label: 'Update date',
            targetColumnMap: {
              value: 'updatedAt',
            },
            icon: 'IconCalendar',
            description: 'Update date',
            isNullable: false,
            isActive: true,
            isCustom: false,
            workspaceId: record.workspaceId,
          },
        ],
    });

    await this.tenantMigrationService.createCustomMigration(
      createdObjectMetadata.workspaceId,
      [
        {
          name: createdObjectMetadata.targetTableName,
          action: 'create',
        } satisfies TenantMigrationTableAction,
      ],
    );

    await this.migrationRunnerService.executeMigrationFromPendingMigrations(
      createdObjectMetadata.workspaceId,
    );

    return createdObjectMetadata;
  }

  public async getObjectMetadataFromWorkspaceId(workspaceId: string) {
    return this.objectMetadataRepository.find({
      where: { workspaceId },
      relations: [
        'fields',
        'fields.fromRelationMetadata',
        'fields.fromRelationMetadata.fromObjectMetadata',
        'fields.fromRelationMetadata.toObjectMetadata',
        'fields.fromRelationMetadata.toObjectMetadata.fields',
        'fields.toRelationMetadata',
        'fields.toRelationMetadata.fromObjectMetadata',
        'fields.toRelationMetadata.fromObjectMetadata.fields',
        'fields.toRelationMetadata.toObjectMetadata',
      ],
    });
  }

  public async getObjectMetadataFromDataSourceId(dataSourceId: string) {
    return this.objectMetadataRepository.find({
      where: { dataSourceId },
      relations: [
        'fields',
        'fields.fromRelationMetadata',
        'fields.fromRelationMetadata.fromObjectMetadata',
        'fields.fromRelationMetadata.toObjectMetadata',
        'fields.fromRelationMetadata.toObjectMetadata.fields',
        'fields.toRelationMetadata',
        'fields.toRelationMetadata.fromObjectMetadata',
        'fields.toRelationMetadata.fromObjectMetadata.fields',
        'fields.toRelationMetadata.toObjectMetadata',
      ],
    });
  }

  public async findOneWithinWorkspace(
    objectMetadataId: string,
    workspaceId: string,
  ) {
    return this.objectMetadataRepository.findOne({
      where: { id: objectMetadataId, workspaceId },
    });
  }

  public async findManyWithinWorkspace(
    objectMetadataIds: string[],
    workspaceId: string,
  ) {
    return this.objectMetadataRepository.findBy({
      id: In(objectMetadataIds),
      workspaceId: Equal(workspaceId),
    });
  }

  public async deleteObjectsMetadata(workspaceId: string) {
    await this.objectMetadataRepository.delete({ workspaceId });
  }
}
