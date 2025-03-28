// 工作流状态枚举
export enum WorkflowStatusEnum {
  // 草稿
  Draft = 0,
  // 已发布
  Published = 1,
  // 已归档
  Archived = 2,
  // 已删除
  Deleted = 3
}

// 工作流实例状态枚举
export enum WorkflowInstanceStatusEnum {
  // 运行中
  Running = 0,
  // 已完成
  Completed = 1,
  // 已失败
  Failed = 2,
  // 已暂停
  Suspended = 3,
  // 已取消
  Cancelled = 4
}

// 工作流DTO
export interface WorkflowDto {
  id: number;
  name: string;
  definition: string;
  workspaceId: number;
  description?: string;
  tags?: string;
  agentId?: number;
  status: WorkflowStatusEnum;
  version: number;
  createdTime: string;
  createdBy: number;
  modifiedTime?: string;
  modifiedBy?: number;
}

// 工作流实例DTO
export interface WorkflowInstanceDto {
  id: number;
  referenceId: string;
  workflowId: number;
  workflowCoreInstanceId?: string;
  workflowVersion: number;
  inputData?: string;
  outputData?: string;
  status: WorkflowInstanceStatusEnum;
  statusMessage?: string;
  createdTime: string;
  createdBy: number;
  modifiedTime?: string;
  modifiedBy?: number;
} 