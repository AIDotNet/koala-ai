import { StateCreator } from "zustand";
import { ChatStore } from "./store";


export interface ChatAction {
  setHistory: (history: any[]) => void;
  rewriteQuery: (id: number) => void;
  deleteUserMessageRagQuery: (id: number) => void;
  openMessageDetail: (id: number) => void;
  openFilePreview: ({
    fileId,
  }: any) => void;
  toggleMessageEditing: (id: number, edit: boolean) => void;
  modifyMessageContent: (id: number, content: string) => void;
  deleteMessage: (id: number) => void;
  regenerateMessage: (id: number) => void;
  translateMessage: (id: number,lang:string) => void;
  ttsMessage: (id: number) => void;
  delAndRegenerateMessage: (id: number) => void;
  copyMessage: (id: number, content: string) => void;
  openThreadCreator: (id: number) => void;
  resendThreadMessage: (id: number) => void;
  delAndResendThreadMessage: (id: number) => void;
  deleteToolMessage: (id: number) => void;
  reInvokeToolMessage: (id: number) => void;
  clearMessage: () => void;
  updateInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
}



export const chatSlice: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatAction
> = (set, get) => ({
  setHistory: (history: any[]) => set({ history }),
  rewriteQuery: (id: number) => {
    const history = get().history;
    const index = history.findIndex((item) => item.id === id);
    if (index !== -1) {
      history[index].content = history[index].ragQuery;
      set({ history });
    }
  },
  deleteUserMessageRagQuery: (id: number) => {
    const history = get().history;
    const index = history.findIndex((item) => item.id === id);
    if (index !== -1) {
      history.splice(index, 1);
      set({ history });
    }
  },
  openMessageDetail: (id: number) => {
    // 打开消息详情

  },
  openFilePreview: ({
    fileId,
  }: any) => {
    // 打开文件预览

  },
  toggleMessageEditing: (id: number, edit: boolean) => {
    if (edit) {
      // 切换消息编辑状态
      const editIds = get().editIds;
      if (editIds.includes(id)) {
        editIds.splice(editIds.indexOf(id), 1);
      } else {
        editIds.push(id);
      }
      set({ editIds });
    } else {
      const editIds = get().editIds;
      const index = editIds.indexOf(id);
      if (index !== -1) {
        editIds.splice(index, 1);
      }
      set({ editIds });
    }

  },
  modifyMessageContent: (id: number, content: string) => {
    // 修改消息内容
    set((state) => {
      const history = state.history;
      const index = history.findIndex((item) => item.id === id);
      if (index !== -1) {
        history[index].content = content;
      }
      return { history };
    });

  },
  deleteMessage: (id: number) => {
    // 删除消息

  },
  regenerateMessage: (id: number) => {
    // 重新生成消息

  },
  translateMessage: (id: number,lang:string) => {
    // 翻译消息

  },
  ttsMessage: (id: number) => {
    // 语音消息

  },
  delAndRegenerateMessage: (id: number) => {
    // 删除并重新生成消息

  },
  copyMessage: (id: number, content: string) => {
    // 复制消息
    
  },
  openThreadCreator: (id: number) => {
    // 打开线程创建器

  },
  resendThreadMessage: (id: number) => {
    // 重新发送线程消息

  },
  delAndResendThreadMessage: (id: number) => {
    // 删除并重新发送线程消息

  },
  deleteToolMessage: (id: number) => {
    // 删除工具消息

  },
  reInvokeToolMessage: (id: number) => {
    // 重新执行工具消息

  },
  clearMessage: () => {
    // 清空消息

  },
  updateInputMessage: (message: string) => {
    set({ inputMessage: message });
  },
  sendMessage: async () => {
    // 发送消息

  },
})
