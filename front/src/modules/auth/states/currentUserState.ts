import { atom } from 'recoil';

import { User } from '@/users/interfaces/user.interface';

export const currentUserState = atom<User | null>({
  key: 'auth/current-user',
  default: null,
});
