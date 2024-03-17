import { createScopeInternalContext } from '../../../../utilities/recoil-scope/scopes-internal/utils/createScopeInternalContext';
import { ComponentStateKey } from '../../../../utilities/state/component-state/types/ComponentStateKey';

type TabListScopeInternalContextProps = ComponentStateKey;

export const TabListScopeInternalContext =
  createScopeInternalContext<TabListScopeInternalContextProps>();
