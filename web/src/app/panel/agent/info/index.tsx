import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, CodeEditor } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Flexbox } from "react-layout-kit";
import { useEffect, useState } from 'react';
import { getAgentInfo } from '@/services/AgentService';
import { Model } from '@/features/Model';
import { Button } from 'antd';
import { SquareChevronLeft, Sparkles } from 'lucide-react';
import Chat from '@/features/Chat';
import Tools from './tools';

const useStyles = createStyles(({ css, token }) => ({
    container: css`
    height: 100vh;
    background: ${token.colorBgContainer};
  `,
    header: css`
    padding: 8px;
    background: ${token.colorBgElevated};
    border-bottom: 1px solid ${token.colorBorder};
    h1 {
      color: ${token.colorText};
      margin: 0;
    }
  `,
    sidebar: css`
    width: 100%;
    padding: 16px;
    background: ${token.colorBgElevated};
    border-bottom: 1px solid ${token.colorBorder};
  `,
    main: css`
    flex: 1;
    gap: 5px;
    height: 100%;
  `,
    mainLeft: css`
    flex: 0.33;
    height: 100%;
    padding: 16px;
    border-right: 1px solid ${token.colorBorder};
    `,
    mainRight: css`
    flex: 0.34;
    height: 100%;
    border-left: 1px solid ${token.colorBorder};
    `,
    mainCenter: css`
    flex: 0.33;
    height: 100%;
    padding: 16px;
    `,
    preview: css`
    text-align: center;
    margin-top: 24px;
    padding: 24px;
    background: ${token.colorBgElevated};
    border-radius: ${token.borderRadiusLG}px;
  `,
    sidebarItem: css`
    background: ${token.colorBgElevated};
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    border-radius: ${token.borderRadiusLG}px;
    span{
        color: ${token.colorText};
        font-size: ${token.fontSizeHeading4}px;
    }
  `
}));

export default function AgentInfo() {
    const { agentId } = useParams();
    const { styles } = useStyles();
    const navigate = useNavigate();

    const [agentInfo, setAgentInfo] = useState<any>(null);

    function getInfo() {
        if (!agentId) return;
        getAgentInfo(Number(agentId)).then((res: any) => {
            setAgentInfo(res.data);
        });
    }

    useEffect(() => {
        getInfo();
    }, []);


    function saveInfo() {
        if (!agentInfo) return;
        // updateAgentInfo(agentInfo);
    }

    return (
        <Flexbox className={styles.container} direction="vertical">
            <Flexbox
                horizontal
                className={styles.header}>
                <Button
                    icon={<SquareChevronLeft />}
                    type='text'
                    size='large'
                    onClick={() => {
                        navigate(-1);
                    }}
                >

                </Button>
                <h1 style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                }}>
                    <Avatar size={36} avatar={agentInfo?.avatar} />
                    {agentInfo?.name}
                </h1>
            </Flexbox>
            <Flexbox className={styles.container} >
                <Flexbox horizontal className={styles.sidebar}>
                    <Flexbox horizontal className={styles.sidebarItem}>
                        <span>
                            编排
                        </span>
                        <Flexbox
                            horizontal
                            style={{
                                float: "right",
                                gap: 8,
                                alignItems: "center"
                            }}>
                            <Model
                                id={agentInfo?.agentConfig.model}
                                onSelect={(value: string) => {
                                    setAgentInfo({
                                        ...agentInfo,
                                        agentConfig: {
                                            ...agentInfo?.agentConfig,
                                            model: value
                                        }
                                    });
                                }}
                            />
                            <Button onClick={() => {
                                saveInfo();
                            }}>
                                保存
                            </Button>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
                <Flexbox
                    horizontal
                    className={styles.main} direction="vertical">
                    <Flexbox className={styles.mainLeft}>
                        <Flexbox style={{
                            width: "100%",
                        }} horizontal>
                            <span style={{
                                flex: 1
                            }}>
                                人设与回复逻辑
                            </span>
                            <Button size='small'>
                                <Sparkles size={16} />
                                优化
                            </Button>
                        </Flexbox>
                        <CodeEditor
                            language="markdown"
                            placeholder="请输入人设与回复逻辑"
                            style={{
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                background: "transparent",
                                padding: 0,
                            }}
                            onValueChange={(value: any) => {
                                setAgentInfo({
                                    ...agentInfo,
                                    agentConfig: {
                                        ...agentInfo?.agentConfig,
                                        prompt: value
                                    }
                                });
                            }}
                            value={agentInfo?.agentConfig.prompt ?? ''}
                        />
                    </Flexbox>
                    <Flexbox className={styles.mainCenter}>
                            <Tools agentInfo={agentInfo}/>
                    </Flexbox>
                    <Flexbox className={styles.mainRight}>
                        {agentId && <Chat agentId={agentId} />}
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        </Flexbox>
    );
}