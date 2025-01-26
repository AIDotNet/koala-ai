'use client';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatItem } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { MouseEventHandler, ReactNode, memo, useCallback, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

// import { useAgentStore } from '@/store/agent';
// import { useChatStore } from '@/store/chat';
// import { chatSelectors } from '@/store/chat/selectors';
// import { useUserStore } from '@/store/user';
// import { ChatMessage } from '@/types/message';

// import ErrorMessageExtra, { useErrorContent } from '../../Error';
import { renderMessagesExtra } from '../../Extras';
import {
    markdownCustomRenders,
    renderBelowMessages,
    renderMessages,
    useAvatarsClick,
} from '../../Messages';
// import History from '../History';
import { markdownElements } from '../MarkdownElements';
import { processWithArtifact } from './utils';
import { ChatMessage } from '@/types/message';
// import { InPortalThreadContext } from './InPortalThreadContext';
// import { processWithArtifact } from './utils';

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);

const useStyles = createStyles(({ css, prefixCls }) => ({
    loading: css`
    opacity: 0.6;
  `,
    message: css`
    position: relative;
    // prevent the textarea too long
    .${prefixCls}-input {
      max-height: 900px;
    }
  `,
}));

export interface ChatListItemProps {
    actionBar?: ReactNode;
    className?: string;
    disableEditing?: boolean;
    enableHistoryDivider?: boolean;
    endRender?: ReactNode;
    id: number;
    inPortalThread?: boolean;
    index: number;
}

const Item = memo<ChatListItemProps>(
    ({
        className,
        enableHistoryDivider,
        id,
        actionBar,
        endRender,
        disableEditing,
        inPortalThread = false,
    }) => {
        const fontSize = 14;
        const { styles, cx } = useStyles();
        const type = 'chat';

        const [item] = useChatStore((state) => [chatSelectors.getMessageById(state, id)]);

        const [
            isMessageLoading,
            generating,
            editing,
            toggleMessageEditing,
            updateMessageContent
        ] = useChatStore((s) => [
            chatSelectors.isMessageLoading(s, id),
            chatSelectors.isMessageGenerating(s, id),
            chatSelectors.isMessageEditing(s, id),
            s.toggleMessageEditing,
            s.modifyMessageContent
        ]);

        // when the message is in RAG flow or the AI generating, it should be in loading state
        // const isProcessing = isInRAGFlow || generating;

        const onAvatarsClick = useAvatarsClick(item?.role);

        const renderMessage = useCallback(
            (editableContent: ReactNode) => {
                if (!item?.role) return;
                const RenderFunction = renderMessages[item.role] ?? renderMessages['default'];

                if (!RenderFunction) return;

                return <RenderFunction {...item} editableContent={editableContent} />;
            },
            [item],
        );

        const onChange = useCallback((value: string) => updateMessageContent(id, value), [id]);

        const BelowMessage = useCallback(
            ({ data }: { data: ChatMessage }) => {
                if (!item?.role) return;
                const RenderFunction = renderBelowMessages[item.role] ?? renderBelowMessages['default'];

                if (!RenderFunction) return;

                return <RenderFunction {...data} />;
            },
            [item?.role],
        );

        const MessageExtra = useCallback(
            ({ data }: { data: ChatMessage }) => {
                if (!item?.role) return;
                let RenderFunction;
                if (renderMessagesExtra?.[item.role]) RenderFunction = renderMessagesExtra[item.role];

                if (!RenderFunction) return;
                return <RenderFunction {...data} />;
            },
            [item?.role],
        );

        const markdownCustomRender = useCallback(
            (dom: ReactNode, { text }: { text: string }) => {
                if (!item?.role) return dom;
                let RenderFunction;

                if (renderMessagesExtra?.[item.role]) RenderFunction = markdownCustomRenders[item.role];
                if (!RenderFunction) return dom;

                return <RenderFunction displayMode={type} dom={dom} id={id} text={text} />;
            },
            [item?.role, type],
        );

        // const error = useErrorContent(item?.error);

        // remove line breaks in artifact tag to make the ast transform easier
        const message =
            !editing && item?.role === 'assistant' ? processWithArtifact(item?.content) : item?.content;

        // ======================= Performance Optimization ======================= //
        // these useMemo/useCallback are all for the performance optimization
        // maybe we can remove it in React 19
        // ======================================================================== //

        const components = useMemo(
            () =>
                Object.fromEntries(
                    markdownElements.map((element) => {
                        const Component = element.Component;

                        return [element.tag, (props: any) => <Component {...props} id={id} />];
                    }),
                ),
            [id],
        );

        const markdownProps = useMemo(
            () => ({
                components,
                customRender: markdownCustomRender,
                rehypePlugins,
            }),
            [components, markdownCustomRender],
        );

        const onDoubleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
            (e) => {
                if (!item || disableEditing) return;
                if (item.id === 'default' || item.error) return;
                if (item.role && ['assistant', 'user'].includes(item.role) && e.altKey) {
                    toggleMessageEditing(id, true);
                }
            },
            [item, disableEditing],
        );

        const text = useMemo(
            () => ({
                cancel: '取消',
                confirm: '确定',
                edit: '编辑',
            }),
            [],
        );

        const onEditingChange = useCallback((edit: boolean) => {
            console.log('onEditingChange', edit);
            toggleMessageEditing(id, edit);
        }, []);

        const belowMessage = useMemo(() => item && <BelowMessage data={item} />, [item]);
        // const errorMessage = useMemo(() => item && <ErrorMessageExtra data={item} />, [item]);
        const messageExtra = useMemo(() => item && <MessageExtra data={item} />, [item]);

        return (
            item && (<>

                {/* {enableHistoryDivider && <History />} */}
                <Flexbox className={cx(styles.message, className && styles.loading)}>
                    <ChatItem
                        actions={actionBar}
                        avatar={item.meta}
                        belowMessage={belowMessage}
                        editing={editing}
                        // error={error}
                        // errorMessage={errorMessage}
                        fontSize={fontSize}
                        loading={isMessageLoading}
                        markdownProps={markdownProps}
                        message={message}
                        messageExtra={messageExtra}
                        onAvatarClick={onAvatarsClick}
                        onChange={onChange}
                        onDoubleClick={onDoubleClick}
                        onEditingChange={onEditingChange}
                        placement={type === 'chat' ? (item.role === 'user' ? 'right' : 'left') : 'left'}
                        primary={item.role === 'user'}
                        renderMessage={renderMessage}
                        text={text}
                        time={item.updatedAt || item.createdAt}
                        type={type === 'chat' ? 'block' : 'pure'}
                    />
                    {endRender}
                </Flexbox>
            </>
            )
        );
    },
);

Item.displayName = 'ChatItem';

export default Item;
