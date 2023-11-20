import { gql } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { useGenerateCreateOneObjectMutation } from '@/object-record/utils/generateCreateOneObjectMutation';
import { useGenerateDeleteOneObjectMutation } from '@/object-record/utils/useGenerateDeleteOneObjectMutation';
import { useGenerateFindManyCustomObjectsQuery } from '@/object-record/utils/useGenerateFindManyCustomObjectsQuery';
import { useGenerateFindOneCustomObjectQuery } from '@/object-record/utils/useGenerateFindOneCustomObjectQuery';
import { useGenerateUpdateOneObjectMutation } from '@/object-record/utils/useGenerateUpdateOneObjectMutation';
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

export const useObjectMetadataItem = ({
  objectNamePlural,
  objectNameSingular,
}: ObjectMetadataItemIdentifier & { skip?: boolean }) => {
  const objectMetadataItem = useRecoilValue(
    objectMetadataItemFamilySelector({
      objectNamePlural,
      objectNameSingular,
    }),
  );

  const objectNotFoundInMetadata = !isDefined(objectMetadataItem);

  const findManyQuery = useGenerateFindManyCustomObjectsQuery({
    objectMetadataItem: objectMetadataItem,
  });

  const findOneQuery = useGenerateFindOneCustomObjectQuery({
    objectMetadataItem: objectMetadataItem,
  });

  const createOneMutation = useGenerateCreateOneObjectMutation({
    objectMetadataItem: objectMetadataItem,
  });

  const updateOneMutation = useGenerateUpdateOneObjectMutation({
    objectMetadataItem: objectMetadataItem,
  });

  const deleteOneMutation = useGenerateDeleteOneObjectMutation({
    objectMetadataItem: objectMetadataItem,
  });

  return {
    objectMetadataItem,
    objectNotFoundInMetadata,
    findManyQuery,
    findOneQuery,
    createOneMutation,
    updateOneMutation,
    deleteOneMutation,
  };
};
