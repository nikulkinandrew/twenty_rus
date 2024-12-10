import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { RecordUpdateHookParams } from '@/object-record/record-field/contexts/FieldContext';
import { RecordIndexRemoveSortingModal } from '@/object-record/record-index/components/RecordIndexRemoveSortingModal';
import { useRecordIndexRootPropsContext } from '@/object-record/record-index/contexts/RecordIndexRootPropsContext';
import { RecordTableWithWrappers } from '@/object-record/record-table/components/RecordTableWithWrappers';

type RecordIndexTableContainerProps = {
  recordTableId: string;
  viewBarId: string;
};

export const RecordIndexTableContainer = ({
  recordTableId,
  viewBarId,
}: RecordIndexTableContainerProps) => {
  const { objectNameSingular } = useRecordIndexRootPropsContext();

  const { updateOneRecord } = useUpdateOneRecord({
    objectNameSingular,
  });

  const updateEntity = ({ variables }: RecordUpdateHookParams) => {
    updateOneRecord?.({
      idToUpdate: variables.where.id as string,
      updateOneRecordInput: variables.updateOneRecordInput,
    });
  };

  return (
    <>
      <RecordTableWithWrappers
        recordTableId={recordTableId}
        objectNameSingular={objectNameSingular}
        viewBarId={viewBarId}
        updateRecordMutation={updateEntity}
      />
      <RecordIndexRemoveSortingModal recordTableId={recordTableId} />
    </>
  );
};
