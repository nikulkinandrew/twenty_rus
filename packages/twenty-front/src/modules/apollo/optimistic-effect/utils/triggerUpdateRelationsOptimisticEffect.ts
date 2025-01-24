import { triggerAttachRelationOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerAttachRelationOptimisticEffect';
import { triggerDestroyRecordsOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerDestroyRecordsOptimisticEffect';
import { triggerDetachRelationOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerDetachRelationOptimisticEffect';
import { CORE_OBJECT_NAMES_TO_DELETE_ON_TRIGGER_RELATION_DETACH } from '@/apollo/types/coreObjectNamesToDeleteOnRelationDetach';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { getRecordsFromRecordConnection } from '@/object-record/cache/utils/getRecordsFromRecordConnection';
import { isObjectRecordConnection } from '@/object-record/cache/utils/isObjectRecordConnection';
import { RecordGqlConnection } from '@/object-record/graphql/types/RecordGqlConnection';
import { RecordGqlNode } from '@/object-record/graphql/types/RecordGqlNode';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { ApolloCache } from '@apollo/client';
import { isArray } from '@sniptt/guards';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';
import { isDefined } from '~/utils/isDefined';

type triggerUpdateRelationsOptimisticEffectArgs = {
  cache: ApolloCache<unknown>;
  sourceObjectMetadataItem: ObjectMetadataItem;
  currentSourceRecord: ObjectRecord | null;
  updatedSourceRecord: ObjectRecord | null;
  objectMetadataItems: ObjectMetadataItem[];
};
export const triggerUpdateRelationsOptimisticEffect = ({
  cache,
  sourceObjectMetadataItem,
  currentSourceRecord,
  updatedSourceRecord,
  objectMetadataItems,
}: triggerUpdateRelationsOptimisticEffectArgs) => {
  console.log({currentSourceRecord, updatedSourceRecord})
  return sourceObjectMetadataItem.fields.forEach(
    (fieldMetadataItemOnSourceRecord) => {
      const notARelationField =
        fieldMetadataItemOnSourceRecord.type !== FieldMetadataType.RELATION;

      if (notARelationField) {
        return;
      }

      const fieldDoesNotExist =
        isDefined(updatedSourceRecord) &&
        !(fieldMetadataItemOnSourceRecord.name in updatedSourceRecord);

      if (fieldDoesNotExist) {
        return;
      }

      const relationDefinition =
        fieldMetadataItemOnSourceRecord.relationDefinition;

      if (!relationDefinition) {
        return;
      }

      const { targetObjectMetadata, targetFieldMetadata } = relationDefinition;

      const fullTargetObjectMetadataItem = objectMetadataItems.find(
        ({ nameSingular }) =>
          nameSingular === targetObjectMetadata.nameSingular,
      );

      if (!fullTargetObjectMetadataItem) {
        return;
      }

      const currentFieldValueOnSourceRecord:
        | RecordGqlConnection
        | RecordGqlNode
        | null = currentSourceRecord?.[fieldMetadataItemOnSourceRecord.name];

      const updatedFieldValueOnSourceRecord:
        | RecordGqlConnection
        | RecordGqlNode
        | null = updatedSourceRecord?.[fieldMetadataItemOnSourceRecord.name];

      if (
        isDeeplyEqual(
          currentFieldValueOnSourceRecord,
          updatedFieldValueOnSourceRecord,
          { strict: true },
        )
      ) {
        return;
      }
      const extractTargetRecordsFromRelation = (
        value: RecordGqlConnection | RecordGqlNode | null,
      ): ObjectRecord[] => {
        // TODO investigate on the root cause of empty array injection here, should never occurs
        // Cache might be corrupted somewhere
        if (!isDefined(value) || isArray(value)) {
          return [];
        }

        if (isObjectRecordConnection(relationDefinition, value)) {
          // Might not be a good idea to return RecordObject here as they might be written in cache later
          return getRecordsFromRecordConnection({ recordConnection: value });
        }

        // Might not be a good idea to return RecordObject here as they might be written in cache later
        return [getRecordFromRecordNode({ recordNode: value })];
      };
      const targetRecordsToDetachFrom = extractTargetRecordsFromRelation(
        currentFieldValueOnSourceRecord,
      );
      const targetRecordsToAttachTo = extractTargetRecordsFromRelation(
        updatedFieldValueOnSourceRecord,
      );

      // TODO: see if we can de-hardcode this, put cascade delete in relation metadata item
      //   Instead of hardcoding it here
      const shouldCascadeDeleteTargetRecords =
        CORE_OBJECT_NAMES_TO_DELETE_ON_TRIGGER_RELATION_DETACH.includes(
          targetObjectMetadata.nameSingular as CoreObjectNameSingular,
        );
      if (shouldCascadeDeleteTargetRecords) {
        triggerDestroyRecordsOptimisticEffect({
          cache,
          objectMetadataItem: fullTargetObjectMetadataItem,
          recordsToDestroy: targetRecordsToDetachFrom,
          objectMetadataItems,
        });
        // Could it be an invariant ?
      } else if (isDefined(currentSourceRecord)) {
        targetRecordsToDetachFrom.forEach((targetRecordToDetachFrom) => {
          triggerDetachRelationOptimisticEffect({
            cache,
            sourceObjectNameSingular: sourceObjectMetadataItem.nameSingular,
            sourceRecordId: currentSourceRecord.id,
            fieldNameOnTargetRecord: targetFieldMetadata.name,
            targetObjectNameSingular: targetObjectMetadata.nameSingular,
            targetRecordId: targetRecordToDetachFrom.id,
          });
        });
      }

      // Could it be an invariant ?
      if (isDefined(updatedSourceRecord)) {
        targetRecordsToAttachTo.forEach((targetRecordsToAttachTo) =>
          triggerAttachRelationOptimisticEffect({
            cache,
            sourceObjectNameSingular: sourceObjectMetadataItem.nameSingular,
            sourceRecordId: updatedSourceRecord.id,
            fieldNameOnTargetRecord: targetFieldMetadata.name,
            targetObjectNameSingular: targetObjectMetadata.nameSingular,
            targetRecordId: targetRecordsToAttachTo.id,
          }),
        );
      }
    },
  );
};
