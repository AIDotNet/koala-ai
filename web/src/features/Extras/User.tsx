import { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatMessage } from '@/types/message';

import { RenderMessageExtra } from '../types';

export const UserMessageExtra: RenderMessageExtra = memo<ChatMessage>(({ extra, id, content }) => {
  const loading = useChatStore((state) => chatSelectors.isMessageGenerating(state,Number(id)));

  const showTranslate = !!extra?.translate;
  const showTTS = !!extra?.tts;

  const showExtra = showTranslate || showTTS;

  if (!showExtra) return;

  return (
    <div style={{ marginTop: 8 }}>
    </div>
  );
});
