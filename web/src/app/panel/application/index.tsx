import Workspace from "@/features/Workspace";
import { useWorkspaceStore } from "@/store/workspace";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Empty, Spin } from "antd";
import styled from "styled-components";

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

const Application = memo(() => {
    const [activeWorkspaceId, setActiveWorkspaceId] = useWorkspaceStore(state => [state.activeWorkspaceId, state.setActiveWorkspaceId]);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setApplications([]);
            setLoading(false);
        }, 2000);
    }, [activeWorkspaceId]);

    return <Flexbox horizontal style={{ width: '100%' }}>
        <Workspace />
        <StyledContainer horizontal>
            {
                loading ? (
                    <Spin />
                ) : (
                    applications.length === 0 ? (
                        <StyledEmpty description="暂无数据" />
                    ) : (
                        applications.map((application, index) => {
                            return <div key={index}>
                                测试
                            </div>
                        })
                    )
                )
            }
        </StyledContainer>
    </Flexbox>
})

export default Application;