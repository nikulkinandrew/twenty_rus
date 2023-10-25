import { useRecoilScopedFamilyState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedFamilyState';
import { useRecoilScopedStateV2 } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedStateV2';

import { availableSortsScopedState } from '../states/availableSortsScopedState';
import { availableViewFieldsScopedFamilyState } from '../states/availableViewFieldsScopedFamilyState';
import { currentViewIdScopedState } from '../states/currentViewIdScopedState';
import { savedSortsScopedFamilyState } from '../states/savedSortsScopedFamilyState';
import { sortsScopedFamilyState } from '../states/sortsScopedFamilyState';
import { viewFieldsScopedFamilyState } from '../states/viewFieldsScopedFamilyState';

export const useViewStates = (scopeId: string) => {
  const [currentViewId, setCurrentViewId] = useRecoilScopedStateV2(
    currentViewIdScopedState,
    scopeId,
  );

  const [sorts, setSorts] = useRecoilScopedFamilyState(
    sortsScopedFamilyState,
    scopeId,
    currentViewId,
  );

  const [savedSorts, setSavedSorts] = useRecoilScopedFamilyState(
    savedSortsScopedFamilyState,
    scopeId,
    currentViewId,
  );

  const [availableSorts, setAvailableSorts] = useRecoilScopedFamilyState(
    availableSortsScopedState,
    scopeId,
    currentViewId,
  );

  const [availableViewFields, setAvailableViewFields] =
    useRecoilScopedFamilyState(
      availableViewFieldsScopedFamilyState,
      scopeId,
      currentViewId,
    );

  const [viewFields, setViewFields] = useRecoilScopedFamilyState(
    viewFieldsScopedFamilyState,
    scopeId,
    currentViewId,
  );

  return {
    currentViewId,
    setCurrentViewId,
    availableSorts,
    setAvailableSorts,
    sorts,
    setSorts,
    savedSorts,
    setSavedSorts,
    availableViewFields,
    setAvailableViewFields,
    viewFields,
    setViewFields,
  };
};
