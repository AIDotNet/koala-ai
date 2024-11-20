import { StateCreator } from 'zustand/vanilla';

import { UserStore } from '../../store';
import { currentUserInfo } from '@/services/UserService';

export interface UserAuthAction {
  /**
   * universal logout method
   */
  logout: () => Promise<void>;
  /**
   * universal login method
   */
  openLogin: () => Promise<void>;
  openUserProfile: () => Promise<void>;
  initUser: () => Promise<void>;
}

export const createAuthSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserAuthAction
> = (set, get) => ({
  logout: async () => {
    
  },
  openLogin: async () => {

  },

  openUserProfile: async () => {
    
  },
  initUser: async () => {
    const user = await currentUserInfo();
    if(user.success) {
        console.log(user.data);
    }else{
        console.log(user.message);
    }
  }
});
