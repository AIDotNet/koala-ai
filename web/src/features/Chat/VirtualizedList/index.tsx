import { Icon } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Loader2Icon } from 'lucide-react';
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import AutoScroll from '../AutoScroll';
// import SkeletonList from '../SkeletonList';

interface VirtualizedListProps {
    dataSource: string[];
    itemContent: (index: number, data: any, context: any) => ReactNode;
    mobile?: boolean;
}

const VirtualizedList = memo<VirtualizedListProps>(({ mobile, dataSource, itemContent }) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [atBottom, setAtBottom] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const [id, isCurrentChatLoaded] = useChatStore((s) => [
        chatSelectors.currentChatKey(s),
        chatSelectors.isCurrentChatLoaded(s),
    ]);

    useEffect(() => {
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({ align: 'end', behavior: 'auto', index: 'LAST' });
        }
    }, [id]);

    const prevDataLengthRef = useRef(dataSource.length);

    const getFollowOutput = useCallback(() => {
        const newFollowOutput = dataSource.length > prevDataLengthRef.current ? 'auto' : false;
        prevDataLengthRef.current = dataSource.length;
        return newFollowOutput;
    }, [dataSource.length]);

    const theme = useTheme();
    // overscan should be 3 times the height of the window
    const overscan = typeof window !== 'undefined' ? window.innerHeight * 3 : 0;

    // first time loading or not loaded
    // if (isFirstLoading) return <SkeletonList mobile={mobile} />;

    if (!isCurrentChatLoaded)
        return <Center height={'100%'} width={'100%'}>
            <Icon
                icon={Loader2Icon}
                size={{ fontSize: 32 }}
                spin
                style={{ color: theme.colorTextTertiary }}
            />
        </Center>;

    return (
        <Flexbox height={'100%'}>
            <Virtuoso
                atBottomStateChange={setAtBottom}
                atBottomThreshold={50 * (mobile ? 2 : 1)}
                computeItemKey={(_, item) => item}
                data={dataSource}
                followOutput={getFollowOutput}
                increaseViewportBy={overscan}
                initialTopMostItemIndex={dataSource?.length - 1}
                isScrolling={setIsScrolling}
                itemContent={itemContent}
                overscan={overscan}
                ref={virtuosoRef}
            />
            <AutoScroll
                atBottom={atBottom}
                isScrolling={isScrolling}
                onScrollToBottom={(type:any) => {
                    const virtuoso = virtuosoRef.current;
                    switch (type) {
                        case 'auto': {
                            virtuoso?.scrollToIndex({ align: 'end', behavior: 'auto', index: 'LAST' });
                            break;
                        }
                        case 'click': {
                            virtuoso?.scrollToIndex({ align: 'end', behavior: 'smooth', index: 'LAST' });
                            break;
                        }
                    }
                }}
            />
        </Flexbox>
    );
});

export default VirtualizedList;
