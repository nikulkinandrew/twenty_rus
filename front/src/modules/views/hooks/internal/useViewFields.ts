import { getOperationName } from '@apollo/client/utilities';
import { useRecoilCallback } from 'recoil';

import { ColumnDefinition } from '@/ui/data/data-table/types/ColumnDefinition';
import { FieldMetadata } from '@/ui/data/field/types/FieldMetadata';
import { currentViewIdScopedState } from '@/views/states/currentViewIdScopedState';
import { currentViewFieldByKeyScopedFamilySelector } from '@/views/states/selectors/currentViewFieldByKeyScopedFamilySelector';
import { viewObjectIdScopeState } from '@/views/states/viewObjectIdScopeState';
import {
  useCreateViewFieldsMutation,
  useUpdateViewFieldMutation,
} from '~/generated/graphql';

import { GET_VIEW_FIELDS } from '../../graphql/queries/getViewFields';

export const toViewFieldInput = (
  objectId: string,
  fieldDefinition: ColumnDefinition<FieldMetadata>,
) => ({
  key: fieldDefinition.key,
  name: fieldDefinition.name,
  index: fieldDefinition.index,
  isVisible: fieldDefinition.isVisible ?? true,
  objectId,
  size: fieldDefinition.size,
});

export const useViewFields = (viewScopeId: string) => {
  const [createViewFieldsMutation] = useCreateViewFieldsMutation();
  const [updateViewFieldMutation] = useUpdateViewFieldMutation();

  const persistViewFields = useRecoilCallback(
    ({ snapshot }) =>
      async (viewFieldsToPersist: ColumnDefinition<FieldMetadata>[]) => {
        const currentViewId = snapshot
          .getLoadable(currentViewIdScopedState({ scopeId: viewScopeId }))
          .getValue();

        const viewObjectId = snapshot
          .getLoadable(viewObjectIdScopeState({ scopeId: viewScopeId }))
          .getValue();

        const currentViewFieldsByKey = snapshot
          .getLoadable(
            currentViewFieldByKeyScopedFamilySelector({
              viewScopeId: viewScopeId,
              viewId: currentViewId,
            }),
          )
          .getValue();

        if (!currentViewId || !currentViewFieldsByKey || !viewObjectId) {
          return;
        }
        const _createViewFields = (
          viewFieldsToCreate: ColumnDefinition<FieldMetadata>[],
          objectId: string,
        ) => {
          if (!currentViewId || !viewFieldsToCreate.length) {
            return;
          }

          return createViewFieldsMutation({
            variables: {
              data: viewFieldsToCreate.map((viewField) => ({
                ...toViewFieldInput(objectId, viewField),
                viewId: currentViewId,
              })),
            },
            refetchQueries: [getOperationName(GET_VIEW_FIELDS) ?? ''],
          });
        };

        const _updateViewFields = (
          viewFieldsToUpdate: ColumnDefinition<FieldMetadata>[],
        ) => {
          if (!currentViewId || !viewFieldsToUpdate.length) {
            return;
          }

          return Promise.all(
            viewFieldsToUpdate.map((viewField) =>
              updateViewFieldMutation({
                variables: {
                  data: {
                    isVisible: viewField.isVisible,
                    size: viewField.size,
                    index: viewField.index,
                  },
                  where: {
                    viewId_key: { key: viewField.key, viewId: currentViewId },
                  },
                },
              }),
            ),
          );
        };

        const viewFieldsToCreate = viewFieldsToPersist.filter(
          (viewField) => !currentViewFieldsByKey[viewField.key],
        );
        await _createViewFields(viewFieldsToCreate, viewObjectId);

        const viewFieldsToUpdate = viewFieldsToPersist.filter(
          (viewFieldToPersit) =>
            currentViewFieldsByKey[viewFieldToPersit.key] &&
            (currentViewFieldsByKey[viewFieldToPersit.key].size !==
              viewFieldToPersit.size ||
              currentViewFieldsByKey[viewFieldToPersit.key].index !==
                viewFieldToPersit.index ||
              currentViewFieldsByKey[viewFieldToPersit.key].isVisible !==
                viewFieldToPersit.isVisible),
        );

        // eslint-disable-next-line no-console
        console.log(viewFieldsToUpdate);
        await _updateViewFields(viewFieldsToUpdate);
      },
  );

  return { persistViewFields };
};
