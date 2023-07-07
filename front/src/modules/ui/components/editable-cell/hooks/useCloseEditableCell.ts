import { useRecoilCallback } from 'recoil';

import { useRecoilScopedState } from '@/recoil-scope/hooks/useRecoilScopedState';
import { isEditModeScopedState } from '@/ui/components/inplace-input/states/isEditModeScopedState';
import { isSomeInputInEditModeState } from '@/ui/tables/states/isSomeInputInEditModeState';

export function useEditableCell() {
  const [, setIsEditMode] = useRecoilScopedState(isEditModeScopedState);

  const closeEditableCell = useRecoilCallback(
    ({ set }) =>
      async () => {
        setIsEditMode(false);

        await new Promise((resolve) => setTimeout(resolve, 20));

        set(isSomeInputInEditModeState, false);
      },
    [setIsEditMode],
  );

  const openEditableCell = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const isSomeInputInEditMode = snapshot
          .getLoadable(isSomeInputInEditModeState)
          .valueOrThrow();

        if (!isSomeInputInEditMode) {
          set(isSomeInputInEditModeState, true);

          setIsEditMode(true);
        }
      },
    [setIsEditMode],
  );

  return {
    closeEditableCell,
    openEditableCell,
  };
}
