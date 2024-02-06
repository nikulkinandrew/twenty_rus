import { ApolloCache, gql, useApolloClient } from '@apollo/client';

import { useMapFieldMetadataToGraphQLQuery } from '@/object-metadata/hooks/useMapFieldMetadataToGraphQLQuery';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { capitalize } from '~/utils/string/capitalize';

export const useGetRecordFromCache = () => {
  const mapFieldMetadataToGraphQLQuery = useMapFieldMetadataToGraphQLQuery();
  const apolloClient = useApolloClient();

  return <CachedObjectRecord extends ObjectRecord = ObjectRecord>({
    recordId,
    cache = apolloClient.cache,
    objectMetadataItem,
  }: {
    recordId: string;
    cache?: ApolloCache<unknown>;
    objectMetadataItem: ObjectMetadataItem;
  }) => {
    if (!objectMetadataItem) {
      return null;
    }

    const capitalizedObjectName = capitalize(objectMetadataItem.nameSingular);

    const cacheReadFragment = gql`
      fragment ${capitalizedObjectName}Fragment on ${capitalizedObjectName} {
        id
        ${objectMetadataItem.fields
          .map((field) => mapFieldMetadataToGraphQLQuery(field))
          .join('\n')}
      }
    `;

    const cachedRecordId = cache.identify({
      __typename: capitalize(objectMetadataItem.nameSingular),
      id: recordId,
    });

    return cache.readFragment<CachedObjectRecord & { __typename: string }>({
      id: cachedRecordId,
      fragment: cacheReadFragment,
    });
  };
};
