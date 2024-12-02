import { get, post, put, del } from '../utils/request';

// 获取应用列表
export const fetchAgents = (workspaceId: number, page: number, pageSize: number, keyword?: string) => {
  const params = new URLSearchParams({ workspaceId: workspaceId.toString(), page: page.toString(), pageSize: pageSize.toString() });
  if (keyword) {
    params.append('keyword', keyword);
  }
  return get(`/api/v1/agent?${params.toString()}`);
};

// 创建应用
export const createAgent = (agentData: any) => {
  return post('/api/v1/agent', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });
};

// 更新应用
export const updateAgent = (id: number, agentData: any) => {
  return put(`/api/v1/agent/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });
};

// 删除应用
export const deleteAgent = (id: number) => {
  return del(`/api/v1/agent/${id}`);
};
