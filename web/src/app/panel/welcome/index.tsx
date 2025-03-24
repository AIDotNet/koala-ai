import { memo } from "react";
import { Flexbox } from 'react-layout-kit';
import { Card, Tabs } from 'antd';
import { Box, FileText, Star } from 'lucide-react';

interface AppCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    type: string;
}

const AppCard = memo(({ title, description, icon, type }: AppCardProps) => {
    return (
        <Card 
            hoverable 
            style={{ 
                width: 300,
                margin: '10px',
                cursor: 'pointer'
            }}
        >
            <Flexbox horizontal gap={12}>
                <div style={{ 
                    padding: '8px',
                    borderRadius: '8px'
                }}>
                    {icon}
                </div>
                <Flexbox>
                    <div style={{ 
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '4px'
                    }}>
                        {title}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.5'
                    }}>
                        {description}
                    </div>
                </Flexbox>
            </Flexbox>
        </Card>
    );
});

const WelcomePanel = memo(() => {
    const recommendedApps: AppCardProps[] = [
        {
            title: 'GPT-Researcher EN',
            description: 'GPT-researcher is an expert in internet topic research. It can efficiently decompose a topic into sub-questions.',
            icon: <Box size={24} />,
            type: 'agent'
        },
        {
            title: 'ChatPaper',
            description: "Let's chat with paper!",
            icon: <FileText size={24} />,
            type: 'chatflow'
        },
        {
            title: 'File Translation',
            description: 'An app that lets you upload files and translate them into any language you need.',
            icon: <FileText size={24} />,
            type: 'chatflow'
        }
    ];

    return (
        <Flexbox padding={24}>
            <Tabs
                defaultActiveKey="recommend"
                items={[
                    {
                        key: 'recommend',
                        label: (
                            <Flexbox horizontal gap={4} align="center">
                                <Star size={16} />
                                <span>推荐</span>
                            </Flexbox>
                        ),
                        children: (
                            <Flexbox>
                                <div style={{ 
                                    fontSize: '14px',
                                    marginBottom: '20px'
                                }}>
                                    使用这些模板应用程序，或根据模板自定义您自己的应用程序。
                                </div>
                                <Flexbox horizontal gap={16} style={{ flexWrap: 'wrap' }}>
                                    {recommendedApps.map((app, index) => (
                                        <AppCard key={index} {...app} />
                                    ))}
                                </Flexbox>
                            </Flexbox>
                        ),
                    },
                    {
                        key: 'agent',
                        label: (
                            <Flexbox horizontal gap={4} align="center">
                                <Box size={16} />
                                <span>Agent</span>
                            </Flexbox>
                        ),
                        children: '智能体内容',
                    },
                    {
                        key: 'assistant',
                        label: (
                            <Flexbox horizontal gap={4} align="center">
                                <FileText size={16} />
                                <span>助手</span>
                            </Flexbox>
                        ),
                        children: '助手内容',
                    },
                ]}
            />
        </Flexbox>
    );
});

WelcomePanel.displayName = "WelcomePanel";
AppCard.displayName = "AppCard";

export default WelcomePanel;

