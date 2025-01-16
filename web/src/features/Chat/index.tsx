import { useChatStore } from "@/store/chat";
import { useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import ChatList from "./ChatList";

export interface ChatProps {
    agentId: string;
    // agentInfo?: AgentInfo;
}

const Chat = (props: ChatProps) => {
    const [history, setHistory] = useChatStore((state) => [state.history, state.setHistory])

    useEffect(() => {
        setHistory([
            {
                content: 'dayjs 如何使用 fromNow',
                createAt: 1_686_437_950_084,
                extra: {},
                id: 1,
                meta: {
                    avatar: 'https://avatars.githubusercontent.com/u/17870709?v=4',
                    title: 'CanisMinor',
                },
                role: 'user',
                updateAt: 1_686_437_950_084,
            }])
    }, [])

    return <Flexbox>
        <ChatList data={history} />
    </Flexbox>
}

export default Chat;
