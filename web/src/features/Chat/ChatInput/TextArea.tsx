import { memo } from 'react';

import InputArea from '@/features/ChatInput/InputArea';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

const TextArea = memo<{ onSend?: () => void }>(({ onSend }) => {
  const [loading, value, updateInputMessage, sendMessage] = useChatStore((s) => [
    chatSelectors.isAIGenerating(s),
    s.inputMessage,
    s.updateInputMessage,
    s.sendMessage,
  ]);

  return (
    <InputArea
      loading={loading}
      onChange={updateInputMessage}
      onSend={() => {
        sendMessage();
        onSend?.();
      }}
      value={value}
    />
  );
});

export default TextArea;
