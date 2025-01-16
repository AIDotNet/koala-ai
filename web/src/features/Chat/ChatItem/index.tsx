import ChatItem from '@/features/Conversation/ChatItem';
import { ActionsBar } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useMemo } from 'react';

const useStyles = createStyles(({ css, token, isDarkMode }) => {
    const borderColor = isDarkMode ? token.colorFillSecondary : token.colorFillTertiary;

    return {
        end: css`
        &::after {
          inset-inline-end: 36px;
          border-inline-end: 2px solid ${borderColor};
          border-end-end-radius: 8px;
        }
      `,
        line: css`
        &::after {
          content: '';
  
          position: absolute;
          inset-block: 56px 50px;
  
          width: 32px;
          border-block-end: 2px solid ${borderColor};
        }
      `,
        start: css`
        &::after {
          inset-inline-start: 36px;
          border-inline-start: 2px solid ${borderColor};
          border-end-start-radius: 8px;
        }
      `,
    };
});


export interface ThreadChatItemProps {
    id: number;
    index: number;
}


const MainChatItem = memo<ThreadChatItemProps>(({ id, index }) => {
    const { styles, cx } = useStyles();

    // const [displayMode] = useAgentStore((s) => {
    //     const config = agentSelectors.currentAgentChatConfig(s);
    //     return [config.displayMode || 'chat'];
    // });

    // const userRole = useChatStore((s) => chatSelectors.getMessageById(id)(s)?.role);

    const placement = 'chat';

    // const [showThread, historyLength] = useChatStore((s) => [
    //     threadSelectors.hasThreadBySourceMsgId(id)(s),
    //     chatSelectors.mainDisplayChatIDs(s).length,
    // ]);

    // const enableHistoryDivider = useAgentStore((s) => {
    //     const config = agentSelectors.currentAgentChatConfig(s);
    //     return (
    //         config.enableHistoryCount &&
    //         historyLength > (config.historyCount ?? 0) &&
    //         config.historyCount === historyLength - index
    //     );
    // });

    const actionBar = useMemo(() => <ActionsBar id={id.toString()} />, [id]);

    return (
        <ChatItem
            actionBar={actionBar}
            // className={showThread ? cx(styles.line, styles['line']) : ''}
            // enableHistoryDivider={enableHistoryDivider}
            // endRender={
            //     // showThread && (
            //     //     // <Thread
            //     //     //     id={id}
            //     //     //     placement={placement}
            //     //     //     style={{ marginTop: displayMode === 'docs' ? 12 : undefined }}
            //     //     // />
            //     //     <></>
            //     // )
            // }
            id={id}
            index={index}
        />
    );
});

export default MainChatItem;
