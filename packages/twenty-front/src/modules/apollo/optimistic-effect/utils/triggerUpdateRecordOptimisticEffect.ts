import { ApolloCache, StoreObject } from '@apollo/client';

import { isCachedObjectConnection } from '@/apollo/optimistic-effect/utils/isCachedObjectConnection';
import { sortCachedObjectEdges } from '@/apollo/optimistic-effect/utils/sortCachedObjectEdges';
import { CachedObjectRecord } from '@/apollo/types/CachedObjectRecord';
import { CachedObjectRecordEdge } from '@/apollo/types/CachedObjectRecordEdge';
import { CachedObjectRecordQueryVariables } from '@/apollo/types/CachedObjectRecordQueryVariables';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { isRecordMatchingFilter } from '@/object-record/record-filter/utils/isRecordMatchingFilter';
import { isDefined } from '~/utils/isDefined';
import { parseApolloStoreFieldName } from '~/utils/parseApolloStoreFieldName';
import { capitalize } from '~/utils/string/capitalize';

export const triggerUpdateRecordOptimisticEffect = ({
  cache,
  objectMetadataItem,
  record,
}: {
  cache: ApolloCache<unknown>;
  objectMetadataItem: ObjectMetadataItem;
  record: CachedObjectRecord;
}) => {
  const objectEdgeTypeName = `${capitalize(
    objectMetadataItem.nameSingular,
  )}Edge`;

  cache.modify<StoreObject>({
    fields: {
      [objectMetadataItem.namePlural]: (
        cachedConnection,
        { INVALIDATE, readField, storeFieldName, toReference },
      ) => {
        if (
          !isCachedObjectConnection(
            objectMetadataItem.nameSingular,
            cachedConnection,
          )
        )
          return cachedConnection;

        const { variables } =
          parseApolloStoreFieldName<CachedObjectRecordQueryVariables>(
            storeFieldName,
          );

        const cachedEdges = readField<CachedObjectRecordEdge[]>(
          'edges',
          cachedConnection,
        );
        let nextCachedEdges = cachedEdges ? [...cachedEdges] : [];

        if (variables?.filter) {
          const matchesFilter = isRecordMatchingFilter({
            record,
            filter: variables.filter,
            objectMetadataItem,
          });
          const recordIndex = nextCachedEdges.findIndex(
            (cachedEdge) => readField('id', cachedEdge.node) === record.id,
          );

          if (matchesFilter && recordIndex === -1) {
            const nodeReference = toReference(record);
            nodeReference &&
              nextCachedEdges.push({
                __typename: objectEdgeTypeName,
                node: nodeReference,
                cursor: '',
              });
          }

          if (!matchesFilter && recordIndex > -1) {
            nextCachedEdges.splice(recordIndex, 1);
          }
        }

        if (variables?.orderBy) {
          nextCachedEdges = sortCachedObjectEdges({
            edges: nextCachedEdges,
            orderBy: variables.orderBy,
            readCacheField: readField,
          });
        }

        if (isDefined(variables?.first)) {
          if (
            cachedEdges?.length === variables.first &&
            nextCachedEdges.length < variables.first
          ) {
            return INVALIDATE;
          }

          if (nextCachedEdges.length > variables.first) {
            nextCachedEdges.splice(variables.first);
          }
        }

        return { ...cachedConnection, edges: nextCachedEdges };
      },
    },
  });
};
