import styled from '@emotion/styled';

import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { RecordTable } from '@/object-record/record-table/components/RecordTable';
import { TableOptionsDropdownId } from '@/object-record/record-table/constants/TableOptionsDropdownId';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { TableOptionsDropdown } from '@/object-record/record-table/options/components/TableOptionsDropdown';
import { useSpreadsheetPersonImport } from '@/people/hooks/useSpreadsheetPersonImport';
import { SpreadsheetImportProvider } from '@/spreadsheet-import/provider/components/SpreadsheetImportProvider';
import { ViewBar } from '@/views/components/ViewBar';
import { mapViewFieldsToColumnDefinitions } from '@/views/utils/mapViewFieldsToColumnDefinitions';
import { mapViewFiltersToFilters } from '@/views/utils/mapViewFiltersToFilters';
import { mapViewSortsToSorts } from '@/views/utils/mapViewSortsToSorts';

import { RecordTableEffect } from './RecordTableEffect';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

export const RecordTableContainer = ({
  objectNamePlural,
  createRecord,
}: {
  objectNamePlural: string;
  createRecord: () => void;
}) => {
  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural,
  });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const { updateOneRecord } = useUpdateOneRecord({
    objectNameSingular,
  });

  const { openPersonSpreadsheetImport } = useSpreadsheetPersonImport();

  const recordTableId = objectNamePlural ?? '';
  const viewBarId = objectNamePlural ?? '';

  const { setTableFilters, setTableSorts, setTableColumns } = useRecordTable({
    recordTableScopeId: recordTableId,
  });

  const updateEntity = ({
    variables,
  }: {
    variables: {
      where: { id: string };
      data: {
        [fieldName: string]: any;
      };
    };
  }) => {
    updateOneRecord?.({
      idToUpdate: variables.where.id,
      input: variables.data,
    });
  };

  const handleImport = () => {
    openPersonSpreadsheetImport();
  };

  return (
    <SpreadsheetImportProvider>
      <StyledContainer>
        <ViewBar
          viewBarId={viewBarId}
          optionsDropdownButton={
            <TableOptionsDropdown
              recordTableId={recordTableId}
              onImport={handleImport}
            />
          }
          optionsDropdownScopeId={TableOptionsDropdownId}
          onViewFieldsChange={(viewFields) => {
            setTableColumns(
              mapViewFieldsToColumnDefinitions(viewFields, columnDefinitions),
            );
          }}
          onViewFiltersChange={(viewFilters) => {
            setTableFilters(mapViewFiltersToFilters(viewFilters));
          }}
          onViewSortsChange={(viewSorts) => {
            setTableSorts(mapViewSortsToSorts(viewSorts));
          }}
        />
        <RecordTableEffect
          recordTableId={recordTableId}
          viewBarId={viewBarId}
        />
        {
          <RecordTable
            recordTableId={recordTableId}
            viewBarId={viewBarId}
            updateRecordMutation={updateEntity}
            createRecord={createRecord}
          />
        }
      </StyledContainer>
    </SpreadsheetImportProvider>
  );
};
