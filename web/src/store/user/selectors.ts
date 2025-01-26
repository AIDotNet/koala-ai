import { UserStore } from "./store";

const useCmdEnterToSend = (s: UserStore): boolean => s.preference.useCmdEnterToSend || false;

export const preferenceSelectors = {
  useCmdEnterToSend,
};

