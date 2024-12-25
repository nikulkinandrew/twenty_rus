import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useCreateBoardRecordFromPending } from '@/object-record/record-board/hooks/useCreateBoardRecordFromPending';
import { viewableRecordIdState } from '@/object-record/record-right-drawer/states/viewableRecordIdState';
import { viewableRecordNameSingularState } from '@/object-record/record-right-drawer/states/viewableRecordNameSingularState';
import { SingleRecordSelect } from '@/object-record/relation-picker/components/SingleRecordSelect';
import { RecordPickerComponentInstanceContext } from '@/object-record/relation-picker/states/contexts/RecordPickerComponentInstanceContext';
import { OverlayContainer } from '@/ui/layout/overlay/components/OverlayContainer';
import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';
import { useRecoilComponentFamilyValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyValueV2';
import { useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { isDefined } from '~/utils/isDefined';
import { RecordBoardContext } from '../../contexts/RecordBoardContext';
import { useCreateNewBoardRecord } from '../../hooks/useCreateNewBoardRecord';
import { recordBoardPendingRecordIdByColumnComponentFamilyState } from '../../states/recordBoardPendingRecordIdByColumnComponentFamilyState';

export const RecordBoardColumnNewOpportunity = ({
  columnId,
  position,
}: {
  columnId: string;
  position: 'first' | 'last';
}) => {
  const { recordBoardId } = useContext(RecordBoardContext);
  const { createNewBoardRecord } = useCreateNewBoardRecord(recordBoardId);

  const { createBoardRecordFromPending } =
    useCreateBoardRecordFromPending(recordBoardId);

  const pendingRecord = useRecoilComponentFamilyValueV2(
    recordBoardPendingRecordIdByColumnComponentFamilyState,
    columnId,
  );

  const { createOneRecord: createCompany } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Company,
  });

  const { openRightDrawer } = useRightDrawer();

  const setViewableRecordId = useSetRecoilState(viewableRecordIdState);
  const setViewableRecordNameSingular = useSetRecoilState(
    viewableRecordNameSingularState,
  );

  const createCompanyOpportunityAndOpenRightDrawer = async (
    searchInput?: string,
  ) => {
    const newRecordId = v4();

    const createdCompany = await createCompany({
      id: newRecordId,
      name: searchInput,
    });

    setViewableRecordId(newRecordId);
    setViewableRecordNameSingular(CoreObjectNameSingular.Company);
    openRightDrawer(RightDrawerPages.ViewRecord);

    if (isDefined(createdCompany)) {
      createNewBoardRecord(columnId, position, true);
    }
  };

  return (
    <>
      {pendingRecord?.recordId &&
        pendingRecord.position === position &&
        pendingRecord.isOpportunity && (
          <OverlayContainer>
            <RecordPickerComponentInstanceContext.Provider
              value={{ instanceId: 'relation-picker' }}
            >
              <SingleRecordSelect
                onCancel={() => createNewBoardRecord(columnId, position, false)}
                onRecordSelected={(company) => {
                  if (isDefined(company)) {
                    createBoardRecordFromPending(columnId, '', company);
                  }
                }}
                objectNameSingular={CoreObjectNameSingular.Company}
                selectedRecordIds={[]}
                onCreate={createCompanyOpportunityAndOpenRightDrawer}
              />
            </RecordPickerComponentInstanceContext.Provider>
          </OverlayContainer>
        )}
    </>
  );
};
