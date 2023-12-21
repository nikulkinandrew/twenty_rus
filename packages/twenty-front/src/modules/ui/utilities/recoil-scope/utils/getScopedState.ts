import { RecoilScopedState } from '../types/RecoilScopedState';

export const getScopedState = <StateType>(
  recoilScopedState: RecoilScopedState<StateType>,
) => {
  return (scopeId: string) =>
    recoilScopedState({
      scopeId,
    });
};
