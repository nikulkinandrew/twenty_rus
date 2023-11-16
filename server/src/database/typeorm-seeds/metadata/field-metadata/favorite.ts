import { DataSource } from 'typeorm';

import { SeedObjectMetadataIds } from 'src/database/typeorm-seeds/metadata/object-metadata';
import { SeedWorkspaceId } from 'src/database/seeds/metadata';
import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';

const fieldMetadataTableName = 'fieldMetadata';

export enum SeedFavoriteFieldMetadataIds {
  Id = '20202020-7d1d-46c7-8c09-8e8c73e30042',
  CreatedAt = '20202020-a0f4-443c-a63d-2776a842d024',
  UpdatedAt = '20202020-273a-41bc-babf-f58f0b2ba2ec',

  Position = '20202020-dd6d-4f67-94aa-22cc83eb0a2e',

  WorkspaceMember = '20202020-1138-4e93-bbff-917a68161abf',
  WorkspaceMemberForeignKey = '20202020-0f4c-4b9a-9b9a-917a68161a4f',
  Person = '20202020-0876-4735-8974-ff4d51aafa07',
  PersonForeignKey = '20202020-0876-4735-9473-ff4d51aa4e7b',
  Company = '20202020-09e1-4384-ae3e-39e7956396fe',
  CompanyV2 = '20202020-09e1-4384-ae3e-39e7956396ff',
  CompanyForeignKey = '20202020-09e1-4384-ae3e-45e79563d528',
}

export const seedFavoriteFieldMetadata = async (
  workspaceDataSource: DataSource,
  schemaName: string,
) => {
  await workspaceDataSource
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${fieldMetadataTableName}`, [
      'id',
      'objectMetadataId',
      'isCustom',
      'workspaceId',
      'isActive',
      'type',
      'name',
      'label',
      'targetColumnMap',
      'description',
      'icon',
      'isNullable',
      'isSystem',
    ])
    .orIgnore()
    .values([
      // Default fields
      {
        id: SeedFavoriteFieldMetadataIds.Id,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.UUID,
        name: 'id',
        label: 'Id',
        targetColumnMap: {
          value: 'id',
        },
        description: undefined,
        icon: undefined,
        isNullable: true,
        isSystem: true,
      },
      {
        id: SeedFavoriteFieldMetadataIds.CreatedAt,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.DATE,
        name: 'createdAt',
        label: 'Creation date',
        targetColumnMap: {
          value: 'createdAt',
        },
        description: undefined,
        icon: 'IconCalendar',
        isNullable: true,
        isSystem: false,
      },
      {
        id: SeedFavoriteFieldMetadataIds.UpdatedAt,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.DATE,
        name: 'updatedAt',
        label: 'Update date',
        targetColumnMap: {
          value: 'updatedAt',
        },
        description: undefined,
        icon: 'IconCalendar',
        isNullable: true,
        isSystem: false,
      },
      // Scalar fields
      {
        id: SeedFavoriteFieldMetadataIds.Position,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.NUMBER,
        name: 'position',
        label: 'Position',
        targetColumnMap: {
          value: 'position',
        },
        description: 'Favorite position',
        icon: 'IconList',
        isNullable: false,
        isSystem: false,
      },

      // Relationships
      {
        id: SeedFavoriteFieldMetadataIds.WorkspaceMember,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.RELATION,
        name: 'workspaceMember',
        label: 'Workspace Member',
        targetColumnMap: {},
        description: 'Favorite workspace member',
        icon: 'IconCircleUser',
        isNullable: false,
        isSystem: false,
      },
      {
        id: SeedFavoriteFieldMetadataIds.WorkspaceMemberForeignKey,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.UUID,
        name: 'workspaceMemberId',
        label: 'Workspace Member ID (foreign key)',
        targetColumnMap: {},
        description: 'Foreign key for workspace member',
        icon: undefined,
        isNullable: false,
        isSystem: true,
      },
      {
        id: SeedFavoriteFieldMetadataIds.Person,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.RELATION,
        name: 'person',
        label: 'Person',
        targetColumnMap: {
          value: 'personId',
        },
        description: 'Favorite person',
        icon: 'IconUser',
        isNullable: true,
        isSystem: false,
      },
      {
        id: SeedFavoriteFieldMetadataIds.PersonForeignKey,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.UUID,
        name: 'personId',
        label: 'Person ID (foreign key)',
        targetColumnMap: {},
        description: 'Foreign key for person',
        icon: undefined,
        isNullable: false,
        isSystem: true,
      },
      {
        id: SeedFavoriteFieldMetadataIds.Company,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.RELATION,
        name: 'company',
        label: 'Company',
        targetColumnMap: {},
        description: 'Favorite company',
        icon: 'IconBuildingSkyscraper',
        isNullable: true,
        isSystem: false,
      },
      {
        id: SeedFavoriteFieldMetadataIds.CompanyForeignKey,
        objectMetadataId: SeedObjectMetadataIds.Favorite,
        isCustom: false,
        workspaceId: SeedWorkspaceId,
        isActive: true,
        type: FieldMetadataType.UUID,
        name: 'companyId',
        label: 'Company ID (foreign key)',
        targetColumnMap: {},
        description: 'Foreign key for company',
        icon: undefined,
        isNullable: false,
        isSystem: true,
      },
    ])
    .execute();
};
