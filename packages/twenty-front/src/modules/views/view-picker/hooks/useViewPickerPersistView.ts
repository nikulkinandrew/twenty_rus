import { useRecoilCallback } from 'recoil';
import { v4 } from 'uuid';

import { useLastVisitedPageOrView } from '@/navigation/hooks/useLastVisitedPageOrView';
import { getSnapshotValue } from '@/ui/utilities/recoil-scope/utils/getSnapshotValue';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { useHandleViews } from '@/views/hooks/useHandleViews';
import { useCloseAndResetViewPicker } from '@/views/view-picker/hooks/useCloseAndResetViewPicker';
import { useViewPickerStates } from '@/views/view-picker/hooks/useViewPickerStates';

export const useViewPickerPersistView = () => {
  const {
    viewPickerInputNameState,
    viewPickerSelectedIconState,
    viewPickerIsPersistingState,
    viewPickerReferenceViewIdState,
    viewPickerKanbanFieldMetadataIdState,
    viewPickerTypeState,
    viewPickerIsDirtyState,
  } = useViewPickerStates();

  const { createView, selectView, removeView, updateView } = useHandleViews();

  const { viewsOnCurrentObject, componentId } = useGetCurrentView();

  const { closeAndResetViewPicker } = useCloseAndResetViewPicker();
  const { setLastVisitedObjectOrView } = useLastVisitedPageOrView();

  const handleCreate = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const name = getSnapshotValue(snapshot, viewPickerInputNameState);
        const iconKey = getSnapshotValue(snapshot, viewPickerSelectedIconState);
        const type = getSnapshotValue(snapshot, viewPickerTypeState);
        const kanbanFieldMetadataId = getSnapshotValue(
          snapshot,
          viewPickerKanbanFieldMetadataIdState,
        );
        const id = v4();
        set(viewPickerIsPersistingState, true);
        set(viewPickerIsDirtyState, false);
        await createView({
          id,
          name,
          icon: iconKey,
          type,
          kanbanFieldMetadataId,
        });
        closeAndResetViewPicker();
        selectView(id);
        setLastVisitedObjectOrView(
          {
            objectMetadataId: componentId,
            viewId: id,
          },
          true,
        );
      },
    [
      closeAndResetViewPicker,
      componentId,
      createView,
      selectView,
      setLastVisitedObjectOrView,
      viewPickerInputNameState,
      viewPickerIsDirtyState,
      viewPickerIsPersistingState,
      viewPickerKanbanFieldMetadataIdState,
      viewPickerSelectedIconState,
      viewPickerTypeState,
    ],
  );

  const handleDelete = useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        set(viewPickerIsPersistingState, true);
        closeAndResetViewPicker();
        set(viewPickerIsDirtyState, false);
        const viewPickerReferenceViewId = getSnapshotValue(
          snapshot,
          viewPickerReferenceViewIdState,
        );

        selectView(
          viewsOnCurrentObject.filter(
            (view) => view.id !== viewPickerReferenceViewId,
          )[0].id,
        );
        await removeView(viewPickerReferenceViewId);
        const [indexOrFirstView] = viewsOnCurrentObject
          .sort((viewA, viewB) =>
            viewA.key === 'INDEX' ? -1 : viewA.position - viewB.position,
          )
          .filter((view) => view.id !== viewPickerReferenceViewId);
        setLastVisitedObjectOrView(
          {
            objectMetadataId: componentId,
            viewId: indexOrFirstView.id,
          },
          true,
        );
      },
    [
      closeAndResetViewPicker,
      componentId,
      removeView,
      selectView,
      setLastVisitedObjectOrView,
      viewPickerIsDirtyState,
      viewPickerIsPersistingState,
      viewPickerReferenceViewIdState,
      viewsOnCurrentObject,
    ],
  );

  const handleUpdate = useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        set(viewPickerIsPersistingState, true);
        set(viewPickerIsDirtyState, false);
        closeAndResetViewPicker();

        const viewPickerReferenceViewId = getSnapshotValue(
          snapshot,
          viewPickerReferenceViewIdState,
        );
        const viewPickerInputName = getSnapshotValue(
          snapshot,
          viewPickerInputNameState,
        );
        const viewPickerSelectedIcon = getSnapshotValue(
          snapshot,
          viewPickerSelectedIconState,
        );

        await updateView({
          id: viewPickerReferenceViewId,
          name: viewPickerInputName,
          icon: viewPickerSelectedIcon,
        });
        selectView(viewPickerReferenceViewId);
      },
    [
      viewPickerIsPersistingState,
      viewPickerIsDirtyState,
      closeAndResetViewPicker,
      viewPickerReferenceViewIdState,
      viewPickerInputNameState,
      viewPickerSelectedIconState,
      updateView,
      selectView,
    ],
  );

  return { handleCreate, handleDelete, handleUpdate };
};
