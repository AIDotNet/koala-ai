import { useChatStore } from "@/store/chat";
import VirtualizedList from "../VirtualizedList";
import Welcome from "../Welcome";
import { isMobileDevice } from "@/utils/responsive";
import { useCallback } from "react";

import MainChatItem from '../ChatItem';

export interface ChatListProps {
    data: any[];
}

const ChatList = ({
    data
}:ChatListProps) => {
    const mobile = isMobileDevice();
    console.log(data);
    
    if (data.length === 0) return <Welcome />;

    const itemContent = useCallback(
        (index: number, id: number) => <MainChatItem id={id} index={index} />,
        [mobile],
      );
    
    return <VirtualizedList dataSource={data} itemContent={itemContent} mobile={false} />;

}

export default ChatList;
