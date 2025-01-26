import { useChatStore } from "@/store/chat";
import { Flexbox } from "react-layout-kit";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { useEffect } from "react";

export interface ChatProps {
    agentId: string;
    // agentInfo?: AgentInfo;
}

const Chat = (props: ChatProps) => {
    const [setHistory,history] = useChatStore((state) => [state.setHistory,state.history])

    useEffect(()=>{
        setHistory([
            {
                content: 'dayjs 如何使用 fromNow',
                createAt: 1_686_437_950_084,
                extra: {},
                id: 1,
                meta: {
                    avatar: 'https://avatars.githubusercontent.com/u/61819790?v=4',
                    title: 'CanisMinor',
                },
                role: 'user',
                updateAt: 1_686_437_950_084,
            }])
    },[props.agentId])

    return <Flexbox style={{
        width: '100%',
        height: '100%',
    }}>
        <ChatList data={history.map((item) => item.id)} />
        <ChatInput />
    </Flexbox>
}

export default Chat;
