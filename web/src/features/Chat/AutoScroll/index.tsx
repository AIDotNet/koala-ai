import { memo, useEffect } from 'react';
import BackBottom from '../BackBottom';

interface AutoScrollProps {
    atBottom: boolean;
    isScrolling: boolean;
    onScrollToBottom: (type: 'auto' | 'click') => void;
}
const AutoScroll = memo<AutoScrollProps>(({ atBottom, isScrolling, onScrollToBottom }) => {

    useEffect(() => {
        if (atBottom && !isScrolling) {
            onScrollToBottom?.('auto');
        }
    }, [atBottom]);

    return <BackBottom onScrollToBottom={() => onScrollToBottom('click')} visible={!atBottom} />;
});

export default AutoScroll;
