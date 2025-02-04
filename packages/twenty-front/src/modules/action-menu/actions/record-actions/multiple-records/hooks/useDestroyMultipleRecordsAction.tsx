import { ActionHookWithObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';

import { contextStoreFiltersComponentState } from '@/context-store/states/contextStoreFiltersComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { computeContextStoreFilters } from '@/context-store/utils/computeContextStoreFilters';
import { DEFAULT_QUERY_PAGE_SIZE } from '@/object-record/constants/DefaultQueryPageSize';
import { DELETE_MAX_COUNT } from '@/object-record/constants/DeleteMaxCount';
import { useDestroyManyRecords } from '@/object-record/hooks/useDestroyManyRecords';
import { useLazyFetchAllRecords } from '@/object-record/hooks/useLazyFetchAllRecords';
import { useFilterValueDependencies } from '@/object-record/record-filter/hooks/useFilterValueDependencies';
import { RecordFilterOperand } from '@/object-record/record-filter/types/RecordFilterOperand';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useCallback, useState } from 'react';
import { isDefined } from 'twenty-shared';

export const useDestroyMultipleRecordsAction: ActionHookWithObjectMetadataItem =
  ({ objectMetadataItem }) => {
    const [isDeleteRecordsModalOpen, setIsDeleteRecordsModalOpen] =
      useState(false);

    const { resetTableRowSelection } = useRecordTable({
      recordTableId: objectMetadataItem.namePlural,
    });

    const { destroyManyRecords } = useDestroyManyRecords({
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
        filter.operand === RecordFilterOperand.IsNotEmpty,
    );

    const { fetchAllRecords: fetchAllRecordIds } = useLazyFetchAllRecords({
      objectNameSingular: objectMetadataItem.nameSingular,
      filter: graphqlFilter,
      limit: DEFAULT_QUERY_PAGE_SIZE,
      recordGqlFields: { id: true },
    });

    const handleDeleteClick = useCallback(async () => {
      // Necessary ?
      const recordsToDestroy = await fetchAllRecordIds();
      const recordIdsToDestroy = recordsToDestroy.map((record) => record.id);

      resetTableRowSelection();

      await destroyManyRecords({ recordIdsToDestroy });
    }, [destroyManyRecords, fetchAllRecordIds, resetTableRowSelection]);

    const isRemoteObject = objectMetadataItem.isRemote;

    console.log({
      isRemoteObject,
      isDeletedFilterActive,
    });
    const shouldBeRegistered =
      !isRemoteObject &&
      isDeletedFilterActive &&
      isDefined(contextStoreNumberOfSelectedRecords) &&
      contextStoreNumberOfSelectedRecords < DELETE_MAX_COUNT &&
      contextStoreNumberOfSelectedRecords > 0;

    const onClick = () => {
      console.log({ shouldBeRegistered });
      if (!shouldBeRegistered) {
        return;
      }

      setIsDeleteRecordsModalOpen(true);
    };

    const confirmationModal = (
      <ConfirmationModal
        isOpen={isDeleteRecordsModalOpen}
        setIsOpen={setIsDeleteRecordsModalOpen}
        title={'Permanently Destroy Records'}
        subtitle={
          "Are you sure you want to destroy these records? They won't be able to be recovered anymore."
        }
        onConfirmClick={handleDeleteClick}
        deleteButtonText={'Destroy Records'}
      />
    );

    return {
      shouldBeRegistered,
      onClick,
      ConfirmationModal: confirmationModal,
    };
  };
