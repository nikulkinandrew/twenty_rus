import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilCallback, useRecoilState } from 'recoil';

import { useFindManyObjects } from '@/metadata/hooks/useFindManyObjects';
import { PaginatedObjectTypeResults } from '@/metadata/types/PaginatedObjectTypeResults';
import { getSnapshotStateValue } from '@/ui/utilities/recoil-scope/utils/getSnapshotValue';
import { assertNotNull } from '~/utils/assert';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

import { useView } from '../hooks/useView';
import { useViewInjectedStates } from '../hooks/useViewInjectedStates';
import { availableFilterDefinitionsScopedState } from '../states/availableFilterDefinitionsScopedState';
import { availableSortDefinitionsScopedState } from '../states/availableSortDefinitionsScopedState';
import { onViewFiltersChangeScopedState } from '../states/onViewFiltersChangeScopedState';
import { onViewSortsChangeScopedState } from '../states/onViewSortsChangeScopedState';
import { savedViewFiltersScopedFamilyState } from '../states/savedViewFiltersScopedFamilyState';
import { savedViewSortsScopedFamilyState } from '../states/savedViewSortsScopedFamilyState';
import { View } from '../types/View';
import { ViewField } from '../types/ViewField';
import { ViewFilter } from '../types/ViewFilter';
import { ViewSort } from '../types/ViewSort';
import { getViewSnapshotInjectedStates } from '../utils/getViewSnapshotInjectedStates';

export const ViewBarEffect = () => {
  const {
    scopeId: viewScopeId,
    setSavedViewFields,
    setCurrentViewFilters,
    setSavedViewFilters,
    setCurrentViewSorts,
    setSavedViewSorts,
    currentViewId,
    setViews,
    loadView,
    changeViewInUrl,
    setCurrentViewId,
  } = useView();

  const [searchParams] = useSearchParams();

  const {
    viewInjectedStates: { viewTypeState, viewObjectIdState },
  } = useViewInjectedStates({
    customViewScopeId: viewScopeId,
  });

  const [viewType] = useRecoilState(viewTypeState);
  const [viewObjectId] = useRecoilState(viewObjectIdState);

  useFindManyObjects({
    objectNamePlural: 'viewsV2',
    filter: { type: { eq: viewType }, objectId: { eq: viewObjectId } },
    onCompleted: useRecoilCallback(
      ({ snapshot }) =>
        async (data: PaginatedObjectTypeResults<View>) => {
          const nextViews = data.edges.map((view) => ({
            id: view.node.id,
            name: view.node.name,
            objectId: view.node.objectId,
          }));

          const {
            viewInjectedStates: { viewsState },
          } = getViewSnapshotInjectedStates({
            snapshot,
            viewScopeId,
          });

          const views = getSnapshotStateValue(snapshot, viewsState);

          if (!isDeeplyEqual(views, nextViews)) setViews(nextViews);

          if (!nextViews.length) return;

          if (!currentViewId) return changeViewInUrl(nextViews[0].id);
        },
    ),
  });

  useFindManyObjects({
    objectNamePlural: 'viewFieldsV2',
    filter: { viewId: { eq: currentViewId } },
    onCompleted: useRecoilCallback(
      ({ snapshot, set }) =>
        async (data: PaginatedObjectTypeResults<ViewField>) => {
          const {
            viewInjectedStates: {
              availableFieldDefinitionsState,
              onViewFieldsChangeState,
              savedViewFieldsState,
              currentViewFieldsState,
            },
          } = getViewSnapshotInjectedStates({
            snapshot,
            viewScopeId,
          });

          const availableFields = getSnapshotStateValue(
            snapshot,
            availableFieldDefinitionsState,
          );

          const onViewFieldsChange = getSnapshotStateValue(
            snapshot,
            onViewFieldsChangeState,
          );

          if (!availableFields || !currentViewId) {
            return;
          }

          const savedViewFields = getSnapshotStateValue(
            snapshot,
            savedViewFieldsState,
          );

          const queriedViewFields = data.edges
            .map((viewField) => viewField.node)
            .filter(assertNotNull);

          if (!isDeeplyEqual(savedViewFields, queriedViewFields)) {
            set(currentViewFieldsState, queriedViewFields);
            setSavedViewFields?.(queriedViewFields);
            onViewFieldsChange?.(queriedViewFields);
          }
        },
    ),
  });

  useFindManyObjects({
    objectNamePlural: 'viewFiltersV2',
    filter: { viewId: { eq: currentViewId } },
    onCompleted: useRecoilCallback(
      ({ snapshot }) =>
        async (data: PaginatedObjectTypeResults<Required<ViewFilter>>) => {
          const availableFilterDefinitions = snapshot
            .getLoadable(
              availableFilterDefinitionsScopedState({ scopeId: viewScopeId }),
            )
            .getValue();

          if (!availableFilterDefinitions || !currentViewId) {
            return;
          }

          const savedViewFilters = snapshot
            .getLoadable(
              savedViewFiltersScopedFamilyState({
                scopeId: viewScopeId,
                familyKey: currentViewId,
              }),
            )
            .getValue();

          const onViewFiltersChange = snapshot
            .getLoadable(
              onViewFiltersChangeScopedState({ scopeId: viewScopeId }),
            )
            .getValue();

          const queriedViewFilters = data.edges
            .map(({ node }) => {
              const availableFilterDefinition = availableFilterDefinitions.find(
                (filterDefinition) => filterDefinition.fieldId === node.fieldId,
              );

              if (!availableFilterDefinition) return null;

              return {
                ...node,
                displayValue: node.displayValue ?? node.value,
                definition: availableFilterDefinition,
              };
            })
            .filter(assertNotNull);

          if (!isDeeplyEqual(savedViewFilters, queriedViewFilters)) {
            setSavedViewFilters?.(queriedViewFilters);
            setCurrentViewFilters?.(queriedViewFilters);
            onViewFiltersChange?.(queriedViewFilters);
          }
        },
    ),
  });

  useFindManyObjects({
    objectNamePlural: 'viewSortsV2',
    filter: { viewId: { eq: currentViewId } },
    onCompleted: useRecoilCallback(
      ({ snapshot }) =>
        async (data: PaginatedObjectTypeResults<Required<ViewSort>>) => {
          const availableSortDefinitions = snapshot
            .getLoadable(
              availableSortDefinitionsScopedState({ scopeId: viewScopeId }),
            )
            .getValue();

          if (!availableSortDefinitions || !currentViewId) {
            return;
          }

          const savedViewSorts = snapshot
            .getLoadable(
              savedViewSortsScopedFamilyState({
                scopeId: viewScopeId,
                familyKey: currentViewId,
              }),
            )
            .getValue();

          const onViewSortsChange = snapshot
            .getLoadable(onViewSortsChangeScopedState({ scopeId: viewScopeId }))
            .getValue();

          const queriedViewSorts = data.edges
            .map(({ node }) => {
              const availableSortDefinition = availableSortDefinitions.find(
                (sort) => sort.fieldId === node.fieldId,
              );

              if (!availableSortDefinition) return null;

              return {
                id: node.id,
                fieldId: node.fieldId,
                direction: node.direction,
                definition: availableSortDefinition,
              };
            })
            .filter(assertNotNull);

          if (!isDeeplyEqual(savedViewSorts, queriedViewSorts)) {
            setSavedViewSorts?.(queriedViewSorts);
            setCurrentViewSorts?.(queriedViewSorts);
            onViewSortsChange?.(queriedViewSorts);
          }
        },
    ),
  });

  const currentViewIdFromUrl = searchParams.get('view');

  useEffect(() => {
    if (!currentViewIdFromUrl) return;
    loadView(currentViewIdFromUrl);
  }, [currentViewIdFromUrl, loadView, setCurrentViewId]);

  return <></>;
};
