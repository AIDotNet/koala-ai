import { get, del, postJson, putJson } from '../utils/request';

// 获取知识列表
export const fetchKnowledges = (workspaceId: number, page: number, pageSize: number, keyword?: string) => {
    const params = new URLSearchParams({ workspaceId: workspaceId.toString(), page: page.toString(), pageSize: pageSize.toString() });
    if (keyword) {
        params.append('keyword', keyword);
    }
    return get(`/api/v1/knowledge/list?${params.toString()}`);
};

// 获取知识详情
export const getKnowledgeInfo = (id: string) => {
    return get(`/api/v1/knowledge/${id}`);
};

// 删除知识
export const deleteKnowledge = (id: string) => {
    return del(`/api/v1/knowledge/${id}`);
};

// 创建知识
export const createKnowledge = (knowledgeData: any) => {
    return postJson('/api/v1/knowledge', knowledgeData);
};

// 更新知识
export const updateKnowledge = (id: string, knowledgeData: any) => {
    return putJson(`/api/v1/knowledge/${id}`, knowledgeData);
};
