import { createState } from '@ui/utilities/state/utils/createState';

export enum SignInUpStep {
  Init = 'init',
  Email = 'email',
  Password = 'password',
  WorkspaceSelection = 'workspaceSelection',
  SSOIdentityProviderSelection = 'SSOIdentityProviderSelection',
}

export const signInUpStepState = createState<SignInUpStep>({
  key: 'signInUpStepState',
  defaultValue: SignInUpStep.Init,
});
