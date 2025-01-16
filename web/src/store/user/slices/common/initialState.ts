export interface CommonState {
    isOnboard: boolean;
    isShowPWAGuide: boolean;
    isUserCanEnableTrace: boolean;
    isUserHasConversation: boolean;
    isUserStateInit: boolean;
    preference: {
      useCmdEnterToSend?: boolean;
    };
  }
  
  export const initialCommonState: CommonState = {
    isOnboard: false,
    isShowPWAGuide: false,
    isUserCanEnableTrace: false,
    isUserHasConversation: false,
    isUserStateInit: false,
    preference: {
    },
  };
  