import { Flexbox } from "react-layout-kit";
import { Spin, Button, Switch, Select, Slider } from "antd";
import { Form, useControls, Input, FormProps, TextArea } from "@lobehub/ui";

export interface ToolsProps {
    agentInfo: any;
}

const Tools = ({
    agentInfo
}: ToolsProps) => {

    const items: FormProps['items'] = [
        {
            title: 'AI配置',
            key: "aiConfig",
            icon: "🤖",
            children: [

                {
                    key: 'temperature',
                    label: '温度',
                    children: (
                        <Slider
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    ),
                },
                {
                    key: 'topP',
                    label: 'Top P',
                    children: (
                        <Slider
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    ),
                },
                {
                    key: 'maxResponseToken',
                    label: '最大响应长度',
                    children: (
                        <Slider
                            min={1024}
                            max={8192}
                            step={1024}
                        />
                    ),
                },
                {
                    key: 'contextSize',
                    label: '上下文长度',
                    children: (
                        <Slider
                            min={1}
                            max={20}
                            step={1}
                        />
                    ),
                }
            ]
        },
        {
            title: '对话配置',
            key: "dialogConfig",
            icon: "💬",
            children: [,
                {
                    key: 'outputFormat',
                    label: '输出格式',
                    children: (
                        <Select
                            options={[
                                { label: 'Markdown', value: 'markdown' },
                                { label: '纯文本', value: 'text' },
                            ]}
                        />
                    ),
                },
                {
                    key: 'opening',
                    label: '开场白',
                    children: (
                        <TextArea
                            placeholder="请输入AI助手的开场白"
                            rows={3}
                        />
                    ),
                },
                {
                    key: 'suggestUserQuestion',
                    label: '建议用户问题',
                    children: (
                        <Switch />
                    ),
                },
            ]
        }
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

    return <Flexbox>
        <Form
            initialValues={agentInfo.agentConfig}
            itemMinWidth={'max(30%,240px)'}
            items={items}
            itemsType={'flat'}
            onFinish={console.table}
            variant={'block'}
        />
    </Flexbox>
}

export default Tools;   