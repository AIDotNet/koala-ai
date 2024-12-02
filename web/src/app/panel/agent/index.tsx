import Workspace from "@/features/Workspace";
import { useWorkspaceStore } from "@/store/workspace";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin } from "antd";
import styled from "styled-components";
import { useAgentStore } from "@/store/agent";

const StyledEmpty = styled(Empty)`
    margin: 20px;
    color: #888;
    .ant-empty-image {
        margin-bottom: 16px;
    }
`;

const StyledContainer = styled(Flexbox)`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Agent = memo(() => {
    const [activeWorkspaceId] = useWorkspaceStore(state => [state.activeWorkspaceId]);
    const { agent, total, inputAgent, loadAgent } = useAgentStore(state => ({
        // 应用列表
        agent: state.agent,
        // 应用总数
        total: state.total,
        // 应用搜索条件
        inputAgent: state.inputAgent,
        // 加载应用列表
        loadAgent: state.loadAgent,
    }));

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeWorkspaceId) {
            setLoading(true);
            loadAgent(activeWorkspaceId).finally(() => {
                setLoading(false);
            });
        }
    }, [activeWorkspaceId]);

    return <Flexbox horizontal style={{ width: '100%' }}>
        <Workspace />
        <Flexbox style={{
            flex: 1,
        }}>
            <Flexbox style={{
                padding: 20,
                width: '100%',
                display: 'flex',
                flexDirection: 'row-reverse',
            }}>
                <Button type="primary"
                    style={{
                        width: '100px',
                    }}
                >
                    创建应用
                </Button>
            </Flexbox>
            <StyledContainer horizontal>
                {
                    activeWorkspaceId ? (
                        loading ? (
                            <Spin />
                        ) : (
                            agent.length === 0 ? (
                                <StyledEmpty description="暂无数据" />
                            ) : (
                                agent.map((application, index) => {
                                    return <div key={index}>
                                        测试
                                    </div>
                                })
                            )
                        )
                    ) : (
                        <StyledEmpty description="请先选择工作空间" />
                    )
                }
            </StyledContainer>
        </Flexbox>
    </Flexbox>
})

export default Agent;