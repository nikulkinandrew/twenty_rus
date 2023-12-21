import { RecoilState, SerializableParam } from 'recoil';

import { ScopedFamilyStateKey } from '../scopes-internal/types/ScopedFamilyStateKey';

export const getScopedFamilyState = <
  StateType,
  FamilyKey extends SerializableParam,
>(
  recoilState: (
    scopedFamilyKey: ScopedFamilyStateKey<FamilyKey>,
  ) => RecoilState<StateType>,
) => {
  return (scopeId: string, familyKey: FamilyKey) =>
    recoilState({
      scopeId,
      familyKey: familyKey || ('' as FamilyKey),
    });
};
