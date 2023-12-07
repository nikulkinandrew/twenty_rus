import { gql } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { ObjectMetadataItemNotFoundError } from '@/object-metadata/errors/ObjectMetadataNotFoundError';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { getObjectMetadataItemsMock } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { useGenerateCreateManyRecordMutation } from '@/object-record/hooks/useGenerateCreateManyRecordMutation';
import { useGenerateCreateOneRecordMutation } from '@/object-record/hooks/useGenerateCreateOneRecordMutation';
import { useGenerateFindManyRecordsQuery } from '@/object-record/hooks/useGenerateFindManyRecordsQuery';
import { useGenerateFindOneRecordQuery } from '@/object-record/hooks/useGenerateFindOneRecordQuery';
import { useGenerateUpdateOneRecordMutation } from '@/object-record/hooks/useGenerateUpdateOneRecordMutation';
import { useGetRecordFromCache } from '@/object-record/hooks/useGetRecordFromCache';
import { useModifyRecordFromCache } from '@/object-record/hooks/useModifyRecordFromCache';
import { ObjectRecordIdentifier } from '@/object-record/types/ObjectRecordIdentifier';
import { generateDeleteOneRecordMutation } from '@/object-record/utils/generateDeleteOneRecordMutation';
import { getLogoUrlFromDomainName } from '~/utils';
import { isDefined } from '~/utils/isDefined';

import { ObjectMetadataItemIdentifier } from '../types/ObjectMetadataItemIdentifier';

export const EMPTY_QUERY = gql`
  query EmptyQuery {
    empty
  }
`;

export const EMPTY_MUTATION = gql`
  mutation EmptyMutation {
    empty
  }
`;

export const useObjectMetadataItem = (
  { objectNameSingular }: ObjectMetadataItemIdentifier,
  depth?: number,
) => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const mockObjectMetadataItems = getObjectMetadataItemsMock();

  let objectMetadataItem = useRecoilValue(
    objectMetadataItemFamilySelector({
      objectName: objectNameSingular,
      objectNameType: 'singular',
    }),
  );

  let objectMetadataItems = useRecoilValue(objectMetadataItemsState);

  if (!currentWorkspace) {
    objectMetadataItem =
      mockObjectMetadataItems.find(
        (objectMetadataItem) =>
          objectMetadataItem.nameSingular === objectNameSingular,
      ) ?? null;
    objectMetadataItems = mockObjectMetadataItems;
  }

  if (!isDefined(objectMetadataItem)) {
    throw new ObjectMetadataItemNotFoundError(
      objectNameSingular,
      objectMetadataItems,
    );
  }

  const mapToObjectRecordIdentifier = (record: any): ObjectRecordIdentifier => {
    if (objectNameSingular === 'company') {
      return {
        id: record.id,
        name: record.name,
        avatarUrl: getLogoUrlFromDomainName(record.domainName ?? ''),
        avatarType: 'squared',
      };
    }

    if (['workspaceMember', 'person'].includes(objectNameSingular)) {
      return {
        id: record.id,
        name:
          (record.name?.firstName ?? '') + ' ' + (record.name?.lastName ?? ''),
        avatarUrl: record.avatarUrl,
        avatarType: 'rounded',
      };
    }

    if (['opportunity'].includes(objectNameSingular)) {
      return {
        id: record.id,
        name: record?.company?.name,
        avatarUrl: record.avatarUrl,
        avatarType: 'rounded',
      };
    }

    return {
      id: record.id,
      name: record.name,
      avatarUrl: record.avatarUrl,
      avatarType: 'rounded',
    };
  };

  const getRecordFromCache = useGetRecordFromCache({
    objectMetadataItem,
  });

  const modifyRecordFromCache = useModifyRecordFromCache({
    objectMetadataItem,
  });

  const findManyRecordsQuery = useGenerateFindManyRecordsQuery({
    objectMetadataItem,
    depth,
  });

  const findOneRecordQuery = useGenerateFindOneRecordQuery({
    objectMetadataItem,
    depth,
  });

  const createOneRecordMutation = useGenerateCreateOneRecordMutation({
    objectMetadataItem,
  });

  const createManyRecordsMutation = useGenerateCreateManyRecordMutation({
    objectMetadataItem,
  });

  const updateOneRecordMutation = useGenerateUpdateOneRecordMutation({
    objectMetadataItem,
  });

  const deleteOneRecordMutation = generateDeleteOneRecordMutation({
    objectMetadataItem,
  });

  const labelIdentifierFieldMetadataId = objectMetadataItem.fields.find(
    ({ name }) => name === 'name',
  )?.id;

  const basePathToShowPage = `/object/${objectMetadataItem.nameSingular}/`;

  return {
    labelIdentifierFieldMetadataId,
    basePathToShowPage,
    objectMetadataItem,
    getRecordFromCache,
    modifyRecordFromCache,
    findManyRecordsQuery,
    findOneRecordQuery,
    createOneRecordMutation,
    updateOneRecordMutation,
    deleteOneRecordMutation,
    createManyRecordsMutation,
    mapToObjectRecordIdentifier,
  };
};
