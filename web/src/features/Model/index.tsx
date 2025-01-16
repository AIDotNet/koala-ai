import { getModelList } from '@/services/modelService';
import {
    Select,
    message
} from 'antd';
import { useState, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Icon, Tooltip } from '@lobehub/ui';
import { getIconByName } from '@/utils/iconutils';


export interface ModelProps {
    id: string;
    onSelect: (id: string) => void;
    style?: React.CSSProperties;
}

export const Model: React.FC<ModelProps> = ({ id, onSelect,style }) => {
    const [modelList, setModelList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const loadModelList = async () => {
        setLoading(true);
        try {
            const res = await getModelList();
            setModelList(res.modelProvider);
        } catch (error) {
            message.error('获取模型列表失败');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadModelList();
    }, []);

    const handleSelect = (value: string) => {
        onSelect(value);
    };

    return <Select
        value={id}
        onChange={handleSelect}
        loading={loading}
        style={{
            ...style,
            width:"180px"
        }}
        placeholder="请选择模型"
        options={
            modelList.map((model) => {
                return {
                    label: <Tooltip
                            title={model.description}
                            >
                        <Flexbox style={{
                        gap: 4,
                        margin:5
                    }} horizontal>
                        {getIconByName(model.icon,24).icon}
                        <span style={{
                            marginLeft: 8,
                            fontSize: 14,
                        }}>
                            {model.name}
                        </span>
                    </Flexbox>
                    </Tooltip>,
                    title: model.name,
                    options: model.models.map((item: any) => {
                        return {
                            label: <span style={{
                                fontSize: 14,
                            }}>{item.displayName}</span>,
                            value: item.id
                        }
                    })
                }
            })
        }
    //         { label: <span>Lucy</span>, value: 'Lucy' },
    //       ],
    //     },
    //     {
    //       label: <span>engineer</span>,
    //       title: 'engineer',
    //       options: [
    //         { label: <span>Chloe</span>, value: 'Chloe' },
    //         { label: <span>Lucas</span>, value: 'Lucas' },
    //       ],
    //     },
    //   ]
    // }
    >
    </Select>;
};
