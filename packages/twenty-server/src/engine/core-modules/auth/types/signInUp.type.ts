import { User } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceAuthProvider } from 'src/engine/core-modules/workspace/types/workspace.type';
import { AppToken } from 'src/engine/core-modules/app-token/app-token.entity';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';

export type SignInUpBaseParams = {
  invitation?: AppToken;
  workspace?: Workspace | null;
  billingCheckoutSessionState?: string | null;
};

export type SignInUpNewUserParams = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;
  passwordHash?: string | null;
};

export type PartialUserWithPicture = {
  picture?: string;
} & Partial<User>;

export type ExistingUserOrNewUser =
  | { existingUser: User }
  | {
      newUserParams: SignInUpNewUserParams;
    };

export type ExistingUserOrPartialUserWithPicture =
  | { existingUser: User }
  | { newUserWithPicture: PartialUserWithPicture };

export type AuthProviderWithPasswordType = {
  authParams:
    | {
        provider: Extract<WorkspaceAuthProvider, 'password'>;
        password: string;
      }
    | {
        provider: Exclude<WorkspaceAuthProvider, 'password'>;
      };
};
