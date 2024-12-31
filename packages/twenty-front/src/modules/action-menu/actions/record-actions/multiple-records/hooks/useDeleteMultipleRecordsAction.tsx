import { ActionHookWithObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { ActionMenuContext } from '@/action-menu/contexts/ActionMenuContext';

import { contextStoreFiltersComponentState } from '@/context-store/states/contextStoreFiltersComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { computeContextStoreFilters } from '@/context-store/utils/computeContextStoreFilters';
import { DEFAULT_QUERY_PAGE_SIZE } from '@/object-record/constants/DefaultQueryPageSize';
import { DELETE_MAX_COUNT } from '@/object-record/constants/DeleteMaxCount';
import { useDeleteManyRecords } from '@/object-record/hooks/useDeleteManyRecords';
import { useLazyFetchAllRecords } from '@/object-record/hooks/useLazyFetchAllRecords';
import { FilterOperand } from '@/object-record/object-filter-dropdown/types/FilterOperand';
import { useFilterValueDependencies } from '@/object-record/record-filter/hooks/useFilterValueDependencies';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useCallback, useContext, useState } from 'react';
import { isDefined } from 'twenty-ui';

export const useDeleteMultipleRecordsAction: ActionHookWithObjectMetadataItem =
  ({ objectMetadataItem }) => {
    const [isDeleteRecordsModalOpen, setIsDeleteRecordsModalOpen] =
      useState(false);

    const { resetTableRowSelection } = useRecordTable({
      recordTableId: objectMetadataItem.namePlural,
    });

    const { deleteManyRecords } = useDeleteManyRecords({
      objectNameSingular: objectMetadataItem.nameSingular,
    });

    const contextStoreNumberOfSelectedRecords = useRecoilComponentValueV2(
      contextStoreNumberOfSelectedRecordsComponentState,
    );

    const contextStoreTargetedRecordsRule = useRecoilComponentValueV2(
      contextStoreTargetedRecordsRuleComponentState,
    );

    const contextStoreFilters = useRecoilComponentValueV2(
      contextStoreFiltersComponentState,
    );

    const { filterValueDependencies } = useFilterValueDependencies();

    const graphqlFilter = computeContextStoreFilters(
      contextStoreTargetedRecordsRule,
      contextStoreFilters,
      objectMetadataItem,
      filterValueDependencies,
    );

    const deletedAtFieldMetadata = objectMetadataItem.fields.find(
      (field) => field.name === 'deletedAt',
    );

    const isDeletedFilterActive = contextStoreFilters.some(
      (filter) =>
        filter.fieldMetadataId === deletedAtFieldMetadata?.id &&
        filter.operand === FilterOperand.IsNotEmpty,
    );

    const { fetchAllRecords: fetchAllRecordIds } = useLazyFetchAllRecords({
      objectNameSingular: objectMetadataItem.nameSingular,
      filter: graphqlFilter,
      limit: DEFAULT_QUERY_PAGE_SIZE,
      recordGqlFields: { id: true },
    });

    const { closeRightDrawer } = useRightDrawer();

    const handleDeleteClick = useCallback(async () => {
      const recordsToDelete = await fetchAllRecordIds();
      const recordIdsToDelete = recordsToDelete.map((record) => record.id);

      resetTableRowSelection();

      await deleteManyRecords(recordIdsToDelete);
    }, [deleteManyRecords, fetchAllRecordIds, resetTableRowSelection]);

    const isRemoteObject = objectMetadataItem.isRemote;

    const {
      isInRightDrawer,
      onActionStartedCallback,
      onActionExecutedCallback,
    } = useContext(ActionMenuContext);

    const shouldBeRegistered =
      !isRemoteObject &&
      !isDeletedFilterActive &&
      isDefined(contextStoreNumberOfSelectedRecords) &&
      contextStoreNumberOfSelectedRecords < DELETE_MAX_COUNT &&
      contextStoreNumberOfSelectedRecords > 0;

    const onClick = () => {
      if (!shouldBeRegistered) {
        return;
      }

      setIsDeleteRecordsModalOpen(true);
    };

    const confirmationModal = (
      <ConfirmationModal
        isOpen={isDeleteRecordsModalOpen}
        setIsOpen={setIsDeleteRecordsModalOpen}
        title={'Delete Records'}
        subtitle={`Are you sure you want to delete these records? They can be recovered from the Options menu.`}
        onConfirmClick={async () => {
          onActionStartedCallback?.({
            key: 'delete-multiple-records',
          });
          await handleDeleteClick();
          onActionExecutedCallback?.({
            key: 'delete-multiple-records',
          });
          if (isInRightDrawer) {
            closeRightDrawer();
          }
        }}
        deleteButtonText={'Delete Records'}
      />
    );

    return {
      shouldBeRegistered,
      onClick,
      ConfirmationModal: confirmationModal,
    };
  };
