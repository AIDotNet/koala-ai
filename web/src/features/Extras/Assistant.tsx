import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatMessage } from '@/types/message';

import { RenderMessageExtra } from '../types';
// import ExtraContainer from './ExtraContainer';
// import Translate from './Translate';

export const AssistantMessageExtra: RenderMessageExtra = memo<ChatMessage>(
  ({ extra, id, content }) => {
    const loading = useChatStore((state) => chatSelectors.isMessageGenerating(state,Number(id)));

    const showTranslate = !!extra?.translate;
    const showTTS = !!extra?.tts;

    const showExtra = showTranslate || showTTS;

    if (!showExtra) return;

    return (
      <Flexbox gap={8} style={{ marginTop: 8 }}>
        <>
          {/* {extra?.translate && (
            <ExtraContainer>
              <Translate id={id} loading={loading} {...extra?.translate} />
            </ExtraContainer>
          )} */}
        </>
      </Flexbox>
    );
  },
);
