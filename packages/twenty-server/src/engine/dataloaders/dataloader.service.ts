import { Injectable } from '@nestjs/common';

import DataLoader from 'dataloader';

import { FieldMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata.interface';
import { ObjectMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/object-metadata.interface';

import { IDataloaders } from 'src/engine/dataloaders/dataloader.interface';
import { FieldMetadataRelationService } from 'src/engine/metadata-modules/field-metadata/relation/field-metadata-relation.service';
import { RelationMetadataEntity } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { RelationMetadataService } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.service';

export type RelationMetadataLoaderPayload = {
  workspaceId: string;
  fieldMetadata: Pick<
    FieldMetadataInterface,
    'type' | 'id' | 'objectMetadataId'
  >;
};

export type RelationLoaderPayload = {
  workspaceId: string;
  fieldMetadata: Pick<
    FieldMetadataInterface,
    | 'type'
    | 'id'
    | 'objectMetadataId'
    | 'relationTargetFieldMetadataId'
    | 'relationTargetObjectMetadataId'
  >;
};

@Injectable()
export class DataloaderService {
  constructor(
    private readonly relationMetadataService: RelationMetadataService,
    private readonly fieldMetadataRelationService: FieldMetadataRelationService,
  ) {}

  createLoaders(): IDataloaders {
    const relationMetadataLoader = this._createRelationMetadataLoader();
    const relationLoader = this._createRelationLoader();

    return {
      relationMetadataLoader,
      relationLoader,
    };
  }

  private _createRelationMetadataLoader() {
    return new DataLoader<
      RelationMetadataLoaderPayload,
      RelationMetadataEntity
    >(async (dataLoaderParams: RelationMetadataLoaderPayload[]) => {
      const workspaceId = dataLoaderParams[0].workspaceId;
      const fieldMetadataItems = dataLoaderParams.map(
        (dataLoaderParam) => dataLoaderParam.fieldMetadata,
      );

      const relationsMetadataCollection =
        await this.relationMetadataService.findManyRelationMetadataByFieldMetadataIds(
          fieldMetadataItems,
          workspaceId,
        );

      return relationsMetadataCollection;
    });
  }

  private _createRelationLoader() {
    return new DataLoader<
      RelationLoaderPayload,
      {
        sourceObjectMetadata: ObjectMetadataInterface;
        targetObjectMetadata: ObjectMetadataInterface;
        sourceFieldMetadata: FieldMetadataInterface;
        targetFieldMetadata: FieldMetadataInterface;
      }
    >(async (dataLoaderParams: RelationLoaderPayload[]) => {
      const workspaceId = dataLoaderParams[0].workspaceId;
      const fieldMetadataItems = dataLoaderParams.map(
        (dataLoaderParam) => dataLoaderParam.fieldMetadata,
      );

      const fieldMetadataRelationCollection =
        await this.fieldMetadataRelationService.findCachedFieldMetadataRelation(
          fieldMetadataItems,
          workspaceId,
        );

      return fieldMetadataRelationCollection;
    });
  }
}
