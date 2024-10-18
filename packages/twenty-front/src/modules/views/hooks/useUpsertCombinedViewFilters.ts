import { useRecoilCallback } from 'recoil';

import { FilterDraft } from '@/object-record/object-filter-dropdown/types/FilterDraft';
import { getSnapshotValue } from '@/ui/utilities/recoil-scope/utils/getSnapshotValue';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { useGetViewFromCache } from '@/views/hooks/useGetViewFromCache';
import { currentViewIdComponentState } from '@/views/states/currentViewIdComponentState';
import { unsavedToDeleteViewFilterIdsComponentFamilyState } from '@/views/states/unsavedToDeleteViewFilterIdsComponentFamilyState';
import { unsavedToUpsertViewFiltersComponentFamilyState } from '@/views/states/unsavedToUpsertViewFiltersComponentFamilyState';
import { ViewFilterDraft } from '@/views/types/ViewFilterDraft';
import { isDefined } from '~/utils/isDefined';

export const useUpsertCombinedViewFilters = (viewBarComponentId?: string) => {
  const unsavedToUpsertViewFiltersCallbackState =
    useRecoilComponentCallbackStateV2(
      unsavedToUpsertViewFiltersComponentFamilyState,
      viewBarComponentId,
    );

  const unsavedToDeleteViewFilterIdsCallbackState =
    useRecoilComponentCallbackStateV2(
      unsavedToDeleteViewFilterIdsComponentFamilyState,
      viewBarComponentId,
    );

  const currentViewIdCallbackState = useRecoilComponentCallbackStateV2(
    currentViewIdComponentState,
    viewBarComponentId,
  );

  const { getViewFromCache } = useGetViewFromCache();

  const upsertCombinedViewFilter = useRecoilCallback(
    ({ snapshot, set }) =>
      async (upsertedFilter: FilterDraft) => {
        const currentViewId = getSnapshotValue(
          snapshot,
          currentViewIdCallbackState,
        );

        const unsavedToUpsertViewFilters = getSnapshotValue(
          snapshot,
          unsavedToUpsertViewFiltersCallbackState({ viewId: currentViewId }),
        );

        const unsavedToDeleteViewFilterIds = getSnapshotValue(
          snapshot,
          unsavedToDeleteViewFilterIdsCallbackState({ viewId: currentViewId }),
        );

        if (!currentViewId) {
          return;
        }

        const currentView = await getViewFromCache(currentViewId);

        if (!currentView) {
          return;
        }

        const matchingFilterInCurrentView = currentView.viewFilters.find(
          (viewFilter) =>
            viewFilter.fieldMetadataId === upsertedFilter.fieldMetadataId &&
            !viewFilter.viewFilterGroupId &&
            !upsertedFilter.viewFilterGroupId,
        );

        const matchingFilterInUnsavedFilters = unsavedToUpsertViewFilters.find(
          (viewFilter) =>
            isDefined(viewFilter.fieldMetadataId) &&
            viewFilter.fieldMetadataId === upsertedFilter.fieldMetadataId &&
            !viewFilter.viewFilterGroupId &&
            !upsertedFilter.viewFilterGroupId,
        );

        if (isDefined(matchingFilterInUnsavedFilters)) {
          const updatedFilters = unsavedToUpsertViewFilters.map((viewFilter) =>
            viewFilter.fieldMetadataId ===
              matchingFilterInUnsavedFilters.fieldMetadataId &&
            !viewFilter.viewFilterGroupId
              ? { ...viewFilter, ...upsertedFilter, id: viewFilter.id }
              : viewFilter,
          );

          set(
            unsavedToUpsertViewFiltersCallbackState({ viewId: currentViewId }),
            updatedFilters,
          );
          return;
        }

        if (isDefined(matchingFilterInCurrentView)) {
          set(
            unsavedToUpsertViewFiltersCallbackState({ viewId: currentViewId }),
            [
              ...unsavedToUpsertViewFilters,
              {
                ...matchingFilterInCurrentView,
                ...upsertedFilter,
                id: matchingFilterInCurrentView.id,
              },
            ],
          );
          set(
            unsavedToDeleteViewFilterIdsCallbackState({
              viewId: currentViewId,
            }),
            unsavedToDeleteViewFilterIds.filter(
              (id) => id !== matchingFilterInCurrentView.id,
            ),
          );
          return;
        }

        const newValue = [
          ...unsavedToUpsertViewFilters,
          {
            ...upsertedFilter,
            id: upsertedFilter.id,
            __typename: 'ViewFilter',
          } satisfies ViewFilterDraft,
        ] satisfies ViewFilterDraft[];

        set(
          unsavedToUpsertViewFiltersCallbackState({ viewId: currentViewId }),
          newValue,
        );
      },
    [
      currentViewIdCallbackState,
      getViewFromCache,
      unsavedToDeleteViewFilterIdsCallbackState,
      unsavedToUpsertViewFiltersCallbackState,
    ],
  );

  return {
    upsertCombinedViewFilter,
  };
};
