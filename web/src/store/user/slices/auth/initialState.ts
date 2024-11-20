import { User } from '@/types/user';

export interface UserAuthState {
  enabledNextAuth?: boolean;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  user?: User;
}

export const initialAuthState: UserAuthState = {
    enabledNextAuth: false,
    isLoaded: false,
    isSignedIn: false,
    user: undefined,
};
