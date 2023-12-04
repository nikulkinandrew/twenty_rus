import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Company } from '@/companies/types/Company';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { PaginatedRecordTypeResults } from '@/object-record/types/PaginatedRecordTypeResults';
import { Opportunity } from '@/pipeline/types/Opportunity';
import { PipelineStep } from '@/pipeline/types/PipelineStep';
import { turnFiltersIntoWhereClause } from '@/ui/object/object-filter-dropdown/utils/turnFiltersIntoWhereClause';
import { turnSortsIntoOrderBy } from '@/ui/object/object-sort-dropdown/utils/turnSortsIntoOrderBy';
import { useRecordBoardScopedStates } from '@/ui/object/record-board/hooks/internal/useRecordBoardScopedStates';
import { useUpdateCompanyBoardCardIdsInternal } from '@/ui/object/record-board/hooks/internal/useUpdateCompanyBoardCardIdsInternal';

import { useFindManyRecords } from './useFindManyRecords';

export const useObjectRecordBoard = () => {
  //const { scopeId: objectNamePlural } = useRecordBoard();
  const objectNamePlural = 'opportunities';
  const updateCompanyBoardCardIds = useUpdateCompanyBoardCardIdsInternal();

  const { objectMetadataItem: foundObjectMetadataItem } = useObjectMetadataItem(
    {
      objectNamePlural,
    },
  );

  const {
    isBoardLoadedState,
    boardFiltersState,
    boardSortsState,
    savedCompaniesState,
    savedOpportunitiesState,
    savedPipelineStepsState,
  } = useRecordBoardScopedStates();

  const setIsBoardLoaded = useSetRecoilState(isBoardLoadedState);

  const boardFilters = useRecoilValue(boardFiltersState);
  const boardSorts = useRecoilValue(boardSortsState);

  const setSavedCompanies = useSetRecoilState(savedCompaniesState);

  const [savedOpportunities, setSavedOpportunities] = useRecoilState(
    savedOpportunitiesState,
  );

  const [savedPipelineSteps, setSavedPipelineSteps] = useRecoilState(
    savedPipelineStepsState,
  );

  const filter = turnFiltersIntoWhereClause(
    boardFilters,
    foundObjectMetadataItem?.fields ?? [],
  );
  const orderBy = turnSortsIntoOrderBy(
    boardSorts,
    foundObjectMetadataItem?.fields ?? [],
  );

  useFindManyRecords({
    objectNamePlural: 'pipelineSteps',
    filter: {},
    onCompleted: useCallback(
      (data: PaginatedRecordTypeResults<PipelineStep>) => {
        setSavedPipelineSteps(data.edges.map((edge) => edge.node));
      },
      [setSavedPipelineSteps],
    ),
  });

  const {
    records: opportunities,
    loading,
    fetchMoreRecords: fetchMoreOpportunities,
  } = useFindManyRecords({
    skip: !savedPipelineSteps.length,
    objectNamePlural: 'opportunities',
    filter: filter,
    orderBy: orderBy,
    onCompleted: useCallback(
      (data: PaginatedRecordTypeResults<Opportunity>) => {
        const pipelineProgresses: Array<Opportunity> = data.edges.map(
          (edge) => edge.node,
        );

        updateCompanyBoardCardIds(pipelineProgresses);

        setSavedOpportunities(pipelineProgresses);
        setIsBoardLoaded(true);
      },
      [setIsBoardLoaded, setSavedOpportunities, updateCompanyBoardCardIds],
    ),
  });

  const { fetchMoreRecords: fetchMoreCompanies } = useFindManyRecords({
    skip: !savedOpportunities.length,
    objectNamePlural: 'companies',
    filter: {
      id: {
        in: savedOpportunities.map(
          (opportunity) => opportunity.companyId || '',
        ),
      },
    },
    onCompleted: useCallback(
      (data: PaginatedRecordTypeResults<Company>) => {
        setSavedCompanies(data.edges.map((edge) => edge.node));
      },
      [setSavedCompanies],
    ),
  });

  return {
    opportunities,
    loading,
    fetchMoreOpportunities,
    fetchMoreCompanies,
  };
};
