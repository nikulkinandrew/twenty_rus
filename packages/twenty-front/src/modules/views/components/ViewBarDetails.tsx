import styled from '@emotion/styled';
import { ReactNode, useMemo } from 'react';

import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { AddObjectFilterFromDetailsButton } from '@/object-record/object-filter-dropdown/components/AddObjectFilterFromDetailsButton';
import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { useHandleToggleTrashColumnFilter } from '@/object-record/record-index/hooks/useHandleToggleTrashColumnFilter';
import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { AdvancedFilterDropdownButton } from '@/views/components/AdvancedFilterDropdownButton';
import { EditableFilterDropdownButton } from '@/views/components/EditableFilterDropdownButton';
import { EditableSortChip } from '@/views/components/EditableSortChip';
import { ViewBarFilterEffect } from '@/views/components/ViewBarFilterEffect';
import { useViewFromQueryParams } from '@/views/hooks/internal/useViewFromQueryParams';

import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useApplyCurrentViewFiltersToCurrentRecordFilters } from '@/views/hooks/useApplyCurrentViewFiltersToCurrentRecordFilters';
import { useAreViewFiltersDifferentFromRecordFilters } from '@/views/hooks/useAreViewFiltersDifferentFromRecordFilters';
import { useAreViewSortsDifferentFromRecordSorts } from '@/views/hooks/useAreViewSortsDifferentFromRecordSorts';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { useResetUnsavedViewStates } from '@/views/hooks/useResetUnsavedViewStates';
import { availableSortDefinitionsComponentState } from '@/views/states/availableSortDefinitionsComponentState';
import { isViewBarExpandedComponentState } from '@/views/states/isViewBarExpandedComponentState';
import { mapViewSortsToSorts } from '@/views/utils/mapViewSortsToSorts';
import { isDefined } from 'twenty-shared';
import { VariantFilterChip } from './VariantFilterChip';

export type ViewBarDetailsProps = {
  hasFilterButton?: boolean;
  rightComponent?: ReactNode;
  filterDropdownId?: string;
  viewBarId: string;
  objectNamePlural: string;
};

const StyledBar = styled.div`
  align-items: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 32px;
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  z-index: 4;
`;

const StyledChipcontainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  gap: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  z-index: 1;
`;

const StyledCancelButton = styled.button`
  background-color: inherit;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  user-select: none;
  margin-right: ${({ theme }) => theme.spacing(2)};
  &:hover {
    background-color: ${({ theme }) => theme.background.tertiary};
    border-radius: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledFilterContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: hidden;
`;

const StyledSeperatorContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledSeperator = styled.div`
  align-self: stretch;
  background: ${({ theme }) => theme.background.quaternary};
  width: 1px;
`;

const StyledAddFilterContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)};
  z-index: 5;
`;

export const ViewBarDetails = ({
  hasFilterButton = false,
  rightComponent,
  filterDropdownId,
  viewBarId,
  objectNamePlural,
}: ViewBarDetailsProps) => {
  const { currentViewWithCombinedFiltersAndSorts } = useGetCurrentView();

  const viewId = currentViewWithCombinedFiltersAndSorts?.id;

  const isViewBarExpanded = useRecoilComponentValueV2(
    isViewBarExpandedComponentState,
  );

  const { hasFiltersQueryParams } = useViewFromQueryParams();

  const currentRecordFilters = useRecoilComponentValueV2(
    currentRecordFiltersComponentState,
  );

  const availableSortDefinitions = useRecoilComponentValueV2(
    availableSortDefinitionsComponentState,
  );

  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural: objectNamePlural,
  });
  const { toggleSoftDeleteFilterState } = useHandleToggleTrashColumnFilter({
    objectNameSingular: objectNameSingular,
    viewBarId: viewBarId,
  });
  const { resetUnsavedViewStates } = useResetUnsavedViewStates();

  const { viewFiltersAreDifferentFromRecordFilters } =
    useAreViewFiltersDifferentFromRecordFilters();

  const { viewSortsAreDifferentFromRecordSorts } =
    useAreViewSortsDifferentFromRecordSorts();

  const canResetView =
    (viewFiltersAreDifferentFromRecordFilters ||
      viewSortsAreDifferentFromRecordSorts) &&
    !hasFiltersQueryParams;

  const otherViewFilters = useMemo(() => {
    return currentRecordFilters.filter(
      (viewFilter) =>
        viewFilter.variant &&
        viewFilter.variant !== 'default' &&
        !viewFilter.viewFilterGroupId,
    );
  }, [currentRecordFilters]);

  const defaultViewFilters = useMemo(() => {
    return currentRecordFilters.filter(
      (viewFilter) =>
        (!viewFilter.variant || viewFilter.variant === 'default') &&
        !viewFilter.viewFilterGroupId,
    );
  }, [currentRecordFilters]);

  const { applyCurrentViewFiltersToCurrentRecordFilters } =
    useApplyCurrentViewFiltersToCurrentRecordFilters();

  const handleCancelClick = () => {
    if (isDefined(viewId)) {
      resetUnsavedViewStates(viewId);
      applyCurrentViewFiltersToCurrentRecordFilters();
      toggleSoftDeleteFilterState(false);
    }
  };

  const shouldExpandViewBar =
    viewFiltersAreDifferentFromRecordFilters ||
    ((currentViewWithCombinedFiltersAndSorts?.viewSorts?.length ||
      currentRecordFilters?.length) &&
      isViewBarExpanded);

  if (!shouldExpandViewBar) {
    return null;
  }

  const showAdvancedFilterDropdownButton =
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups &&
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups.length > 0;

  return (
    <StyledBar>
      <StyledFilterContainer>
        <StyledChipcontainer>
          {otherViewFilters.map((viewFilter) => (
            <VariantFilterChip
              key={viewFilter.fieldMetadataId}
              recordFilter={viewFilter}
              viewBarId={viewBarId}
            />
          ))}
          {!!otherViewFilters.length &&
            !!currentViewWithCombinedFiltersAndSorts?.viewSorts?.length && (
              <StyledSeperatorContainer>
                <StyledSeperator />
              </StyledSeperatorContainer>
            )}
          {mapViewSortsToSorts(
            currentViewWithCombinedFiltersAndSorts?.viewSorts ?? [],
            availableSortDefinitions,
          ).map((sort) => (
            <EditableSortChip key={sort.fieldMetadataId} viewSort={sort} />
          ))}
          {!!currentViewWithCombinedFiltersAndSorts?.viewSorts?.length &&
            !!defaultViewFilters.length && (
              <StyledSeperatorContainer>
                <StyledSeperator />
              </StyledSeperatorContainer>
            )}
          {showAdvancedFilterDropdownButton && <AdvancedFilterDropdownButton />}
          {defaultViewFilters.map((viewFilter) => (
            <ObjectFilterDropdownComponentInstanceContext.Provider
              key={viewFilter.id}
              value={{ instanceId: viewFilter.id }}
            >
              <DropdownScope dropdownScopeId={viewFilter.id}>
                <ViewBarFilterEffect filterDropdownId={viewFilter.id} />
                <EditableFilterDropdownButton
                  viewFilter={viewFilter}
                  hotkeyScope={{
                    scope: viewFilter.id,
                  }}
                  viewFilterDropdownId={viewFilter.id}
                />
              </DropdownScope>
            </ObjectFilterDropdownComponentInstanceContext.Provider>
          ))}
        </StyledChipcontainer>
        {hasFilterButton && (
          <StyledAddFilterContainer>
            <AddObjectFilterFromDetailsButton
              filterDropdownId={filterDropdownId}
            />
          </StyledAddFilterContainer>
        )}
      </StyledFilterContainer>
      {canResetView && (
        <StyledCancelButton
          data-testid="cancel-button"
          onClick={handleCancelClick}
        >
          Reset
        </StyledCancelButton>
      )}
      {rightComponent}
    </StyledBar>
  );
};
