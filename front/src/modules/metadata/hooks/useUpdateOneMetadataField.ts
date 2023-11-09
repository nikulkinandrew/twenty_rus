import { useMutation } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';

import {
  UpdateOneMetadataFieldMutation,
  UpdateOneMetadataFieldMutationVariables,
} from '~/generated-metadata/graphql';

import { UPDATE_ONE_METADATA_FIELD } from '../graphql/mutations';
import { FIND_MANY_METADATA_OBJECTS } from '../graphql/queries';

import { useApolloMetadataClient } from './useApolloMetadataClient';

export const useUpdateOneMetadataField = () => {
  const apolloMetadataClient = useApolloMetadataClient();

  const [mutate] = useMutation<
    UpdateOneMetadataFieldMutation,
    UpdateOneMetadataFieldMutationVariables
  >(UPDATE_ONE_METADATA_FIELD, {
    client: apolloMetadataClient ?? undefined,
  });

  const updateOneMetadataField = async ({
    fieldMetadataIdToUpdate,
    updatePayload,
  }: {
    fieldMetadataIdToUpdate: UpdateOneMetadataFieldMutationVariables['idToUpdate'];
    updatePayload: Pick<
      UpdateOneMetadataFieldMutationVariables['updatePayload'],
      'description' | 'icon' | 'isActive' | 'label' | 'name'
    >;
  }) => {
    return await mutate({
      variables: {
        idToUpdate: fieldMetadataIdToUpdate,
        updatePayload: {
          ...updatePayload,
          label: updatePayload.label ?? undefined,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [getOperationName(FIND_MANY_METADATA_OBJECTS) ?? ''],
    });
  };

  return {
    updateOneMetadataField,
  };
};
