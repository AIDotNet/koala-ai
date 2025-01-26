import { Flexbox } from "react-layout-kit";
import { Spin, Switch, Select, Slider, Button } from "antd";
import { Form, FormProps, TextArea } from "@lobehub/ui";
import { Brain, MessageSquareText } from "lucide-react";
import { useState } from "react";

export interface ToolsProps {
    agentInfo: any;
}

enum ActiveKey {
    aiConfig = 'aiConfig',
    dialogConfig = 'dialogConfig',
}

const Tools = ({
    agentInfo
}: ToolsProps) => {
    const [active, setActive] = useState<ActiveKey[]>([ActiveKey.aiConfig]);

    const items: FormProps['items'] = [
        {
            children: [
                {
                    children: <Slider
                        min={0}
                        style={{
                            minWidth: '100px'
                        }}
                        max={1}
                        step={0.1}
                    />,
                    desc: '温度影响到AI的创造性，值越大，AI的创造性越强',
                    label: '温度',
                    minWidth: undefined,
                    name: 'temperature'
                },
                {
                    name: 'topP',
                    label: 'Top P',
                    minWidth: undefined,
                    children: (
                        <Slider
                            min={0}
                            style={{
                                minWidth: '100px'
                            }}
                            max={1}
                            step={0.1}
                        />
                    ),
                },
                {
                    name: 'maxResponseToken',
                    label: '最大响应长度',
                    minWidth: undefined,
                    children: (
                        <Slider
                            min={1024}
                            style={{
                                minWidth: '100px'
                            }}
                            max={8192}
                            step={1024}
                        />
                    ),
                },
                {
                    name: 'contextSize',
                    label: '上下文长度',
                    minWidth: undefined,
                    children: (
                        <Slider
                            min={1}
                            style={{
                                minWidth: '100px'
                            }}
                            max={20}
                            step={1}
                        />
                    ),
                },
            ],
            extra: (
                <Switch
                    onChange={(v) => {
                        setActive((prev) =>
                            v ? [...prev, ActiveKey.aiConfig] : prev.filter((key) => key !== ActiveKey.aiConfig),
                        );
                    }}
                    value={active.includes(ActiveKey.aiConfig)}
                />
            ),
            icon: Brain,
            key: ActiveKey.aiConfig,
            title: 'AI配置',
        },
        {
            children: [
                {
                    children: <Select
                        style={{
                            minWidth: '100px'
                        }}
                        options={[
                            { label: 'Markdown', value: 'markdown' },
                            { label: '纯文本', value: 'text' },
                        ]}
                    />,
                    desc: 'AI输出格式',
                    label: '输出格式',
                    name: 'outputFormat'
                },
                {
                    children: (
                        <TextArea
                            placeholder="请输入AI助手的开场白"
                            rows={3}
                        />
                    ),
                    desc: 'AI助手的开场白',
                    label: '开场白',
                    name: 'opening',
                },
                {
                    children: <Switch />,
                    desc: 'AI是否建议用户问题',
                    label: '建议用户问题',
                    name: 'suggestUserQuestion',
                },
            ],
            extra: (
                <Switch
                    onChange={(v) => {
                        setActive((prev) =>
                            v ? [...prev, ActiveKey.dialogConfig] : prev.filter((key) => key !== ActiveKey.dialogConfig),
                        );
                    }}
                    value={active.includes(ActiveKey.dialogConfig)}
                />
            ),
            defaultActive: true,
            icon: MessageSquareText,
            key: ActiveKey.dialogConfig,
            collapsible: true,
            title: '对话配置',
        },
    ];


    function onSubmit(values: any) {
        console.log(values);
    }

    if (!agentInfo) return <Flexbox style={{
        // 居中显示
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }}>
        <Spin />
    </Flexbox>;

    return <Form
        activeKey={active}
        collapsible={true}
        style={{
            overflow: 'auto',
            height: 'calc(100vh - 165px)',
        }}
        defaultActiveKey={['theme']}
        footer={<Button
            block
            style={{

            }}>保存</Button>}
        initialValues={agentInfo.agentConfig}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        // onCollapse={(keys) => {
        //     const key = keys[0];
        //     console.log(key);

        //     // 如果这个key存在了那么从数组删除，如果不存在则添加
        //     if (active.includes(key as ActiveKey)) {
        //         setActive([...active.filter((k) => k !== key as ActiveKey)]);
        //     } else {
        //         active.push(key as ActiveKey);
        //         setActive(active);
        //     }
        // }}
        onFinish={onSubmit}
        variant={'default'}
    />
}

export default Tools;   