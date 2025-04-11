import { get, post, put } from '../utils/request';
import { WorkflowStatusEnum, WorkflowInstanceStatusEnum } from '../types/workflow';

// 工作流模板定义
export const workflowTemplates = {
  empty: {
    nodes: [
      {
        id: 'node-input-1',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          label: '输入',
          nodeType: 'input',
          inputs: {},
          outputs: {
            'text': 'string',
          }
        }
      },
      {
        id: 'node-output-1',
        type: 'output',
        position: { x: 500, y: 200 },
        data: {
          label: '输出',
          nodeType: 'output',
          inputs: {
            'text': 'string'
          },
          outputs: {}
        }
      }
    ],
    edges: []
  }
};

// 获取工作空间下的工作流列表
export const fetchWorkflows = (workspaceId: number, status?: number) => {
  const params = new URLSearchParams({ workspaceId: workspaceId.toString() });
  if (status !== undefined) {
    params.append('status', status.toString());
  }
  return get(`/api/v1/workflow?${params.toString()}`);
};

// 获取工作流详情
export const getWorkflow = (id: number) => {
  return get(`/api/v1/workflow/${id}`);
};

// 创建工作流
export const createWorkflow = (name: string, definition: string, workspaceId: number, description?: string, tags?: string, agentId?: number) => {
  const data = {
    name,
    definition,
    workspaceId,
    description,
    tags,
    agentId
  };

  return post('/api/v1/workflow', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 更新工作流
export const updateWorkflow = (id: number, name: string, definition: string, description?: string, tags?: string) => {
  const data = {
    name,
    definition,
    description,
    tags
  };

  return put(`/api/v1/workflow/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 更新工作流状态
export const updateWorkflowStatus = (id: number, status: WorkflowStatusEnum) => {
  return put(`/api/v1/workflow/${id}/status?status=` + status);
};

// 绑定智能体
export const bindAgent = (workflowId: number, agentId: number) => {
  return put(`/api/v1/workflow/${workflowId}/bind-agent/${agentId}`);
};

// 解绑智能体
export const unbindAgent = (workflowId: number) => {
  return put(`/api/v1/workflow/${workflowId}/unbind-agent`);
};

// 执行工作流
export const executeWorkflow = (workflowId: number, data:any) => {

  return post(`/api/v1/workflow/${workflowId}/execute`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 获取工作流实例详情
export const getWorkflowInstanceInfo = (instanceId: string) => {
  return get(`/api/v1/workflow/instance/${instanceId}`);
};

// 获取工作流实例列表
export const fetchWorkflowInstances = (workflowId: number, status?: WorkflowInstanceStatusEnum) => {
  const params = new URLSearchParams();
  if (status !== undefined) {
    params.append('status', status.toString());
  }
  return get(`/api/v1/workflow/${workflowId}/instances?${params.toString()}`);
};

// 暂停工作流实例
export const suspendWorkflowInstance = (instanceId: string) => {
  return put(`/api/v1/workflow/instance/${instanceId}/suspend`);
};

// 恢复工作流实例
export const resumeWorkflowInstance = (instanceId: string) => {
  return put(`/api/v1/workflow/instance/${instanceId}/resume`);
};

// 取消工作流实例
export const cancelWorkflowInstance = (instanceId: string) => {
  return put(`/api/v1/workflow/instance/${instanceId}/cancel`);
}; 