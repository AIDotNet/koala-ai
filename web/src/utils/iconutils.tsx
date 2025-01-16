import { IconAvatar } from "@lobehub/icons";

import {
    OpenAI,
    ChatGLM,
    Claude,
    Baichuan,
    Ai21,
    Google,
    Grok,
    Hunyuan,
    Minimax,
    Spark,
    Moonshot,
    Wenxin,
    Yi,
    Zhipu,
    DeepSeek,
    Qingyan,
    Qwen,
    Kimi
} from '@lobehub/icons';

export function getIconByNames(size: number = 24) {
    const models = [
        'OpenAI',
        'ChatGLM',
        'Claude',
        'Baichuan',
        'Ai21',
        'Google',
        'Grok',
        'Hunyuan',
        'Minimax',
        'Spark',
        'Wenxin',
        'Yi',
        'Zhipu',
        "Moonshot",
        'DeepSeek',
        "Qingyan",
        "Qwen",
        "Kimi"
    ]

    return models.map((name) => {
        const icon = getIconByName(name, size);
        return {
            label: <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                {icon?.icon}
                <span style={{
                    marginLeft: 8,

                }}>{icon?.label}</span>
            </div>,
            value: name,
        }
    })
}

// 根据名称获取对应的图标
export function getIconByName(name: string, size: number = 36) {
    switch (name) {
        case 'OpenAI':
            return {
                icon: <IconAvatar Icon={OpenAI} size={size} />,
                label: 'OpenAI'
            };
        case 'ChatGLM':
            return {
                icon: <IconAvatar Icon={ChatGLM} size={size} />,
                label: 'ChatGLM'
            };
        case 'Claude':
            return {
                icon: <IconAvatar Icon={Claude} size={size} />,
                label: 'Claude'
            };
        case 'Baichuan':
            return {
                icon: <IconAvatar Icon={Baichuan} size={size} />,
                label: 'Baichuan'
            };
        case 'Ai21':
            return {
                icon: <IconAvatar Icon={Ai21} size={size} />,
                label: 'Ai21'
            };
        case 'Google':
            return {
                icon: <IconAvatar Icon={Google} size={size} />,
                label: 'Google'
            };
        case 'Grok':
            return {
                icon: <IconAvatar Icon={Grok} size={size} />,
                label: 'Grok'
            };
        case 'Hunyuan':
            return {
                icon: <IconAvatar Icon={Hunyuan} size={size} />,
                label: 'Hunyuan'
            };
        case 'Minimax':
            return {
                icon: <IconAvatar Icon={Minimax} size={size} />,
                label: 'Minimax'
            };
        case 'Spark':
            return {
                icon: <IconAvatar Icon={Spark} size={size} />,
                label: 'Spark'
            };
        case 'Wenxin':
            return {
                icon: <IconAvatar Icon={Wenxin} size={size} />,
                label: 'Wenxin'
            };
        case 'Yi':
            return {
                icon: <IconAvatar Icon={Yi} size={size} />,
                label: 'Yi'
            };
        case 'Zhipu':
            return {
                icon: <IconAvatar Icon={Zhipu} size={size} />,
                label: 'Zhipu'
            };
        case 'Moonshot':
            return {
                icon: <IconAvatar Icon={Moonshot} size={size} />,
                label: 'Moonshot'
            };
        case 'DeepSeek':
            return {
                icon: <IconAvatar Icon={DeepSeek} size={size} />,
                label: 'DeepSeek'
            };
        case 'Qingyan':
            return {
                icon: <IconAvatar Icon={Qingyan} size={size} />,
                label: 'Qingyan'
            };
        case 'Qwen':
            return {
                icon: <IconAvatar Icon={Qwen} size={size} />,
                label: 'Qwen'
            };
        case 'Kimi':
            return {
                icon: <IconAvatar Icon={Kimi} size={size} />,
                label: 'Kimi'
            };
        default:
            return {
                icon: <IconAvatar Icon={OpenAI} size={size} />,
                label: 'OpenAI'
            };
    }
}