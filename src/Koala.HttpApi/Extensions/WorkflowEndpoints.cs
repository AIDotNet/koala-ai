﻿using Koala.Application.Contract.WorkFlows;
using Koala.Application.Contract.WorkFlows.Dto;
using Koala.Domain.WorkFlows.Enums;
using Koala.HttpApi.Filter;

namespace Koala.HttpApi.Extensions;

public static class WorkflowEndpoints
{
    public static IEndpointRouteBuilder MapWorkflowEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var workflow = endpoint.MapGroup("/api/v1/workflow")
            .WithTags("工作流管理")
            .AddEndpointFilter<ResultFilter>();

        // 工作流管理
        workflow.MapGet("",
            [EndpointSummary("获取工作空间下的工作流列表"), EndpointDescription("获取工作空间下的工作流列表")]
            async (IWorkflowService service, long workspaceId, long? status) =>
                await service.GetWorkflowsByWorkspaceAsync(workspaceId,
                    status.HasValue ? (WorkflowStatusEnum)status.Value : null));

        workflow.MapGet("{id}",
            [EndpointSummary("获取工作流详情"), EndpointDescription("获取工作流详情")]
            async (IWorkflowService service, long id) =>
                await service.GetWorkflowAsync(id));

        workflow.MapPost("",
            [EndpointSummary("创建工作流"), EndpointDescription("创建工作流")]
            async (IWorkflowService service, CreateWorkflowDto request) =>
                await service.CreateWorkflowAsync(request.Name, request.Definition, request.WorkspaceId,
                    request.Description, request.Tags, request.AgentId));

        workflow.MapPut("{id}",
            [EndpointSummary("更新工作流"), EndpointDescription("更新工作流")]
            async (IWorkflowService service, long id, UpdateWorkflowDto request) =>
                await service.UpdateWorkflowAsync(id, request.Name, request.Definition, request.Description,
                    request.Tags));

        workflow.MapPut("{id}/status",
            [EndpointSummary("更新工作流状态"), EndpointDescription("更新工作流状态")]
            async (IWorkflowService service, long id, WorkflowStatusEnum status) =>
                await service.UpdateWorkflowStatusAsync(id, status));

        workflow.MapPut("{id}/bind-agent/{agentId}",
            [EndpointSummary("绑定智能体"), EndpointDescription("绑定智能体")]
            async (IWorkflowService service, long id, long agentId) =>
                await service.BindAgentAsync(id, agentId));

        workflow.MapPut("{id}/unbind-agent",
            [EndpointSummary("解绑智能体"), EndpointDescription("解绑智能体")]
            async (IWorkflowService service, long id) =>
                await service.UnbindAgentAsync(id));

        // 工作流实例管理
        workflow.MapPost("{id}/execute",
            [EndpointSummary("执行工作流"), EndpointDescription("执行工作流")]
            async (IWorkflowService service, long id, ExecuteWorkflowInput input) =>
                await service.ExecuteWorkflowAsync(id, input.InputParameters, input.InputData));

        workflow.MapGet("instance/{instanceId}",
            [EndpointSummary("获取工作流实例详情"), EndpointDescription("获取工作流实例详情")]
            async (IWorkflowService service, string instanceId) =>
                await service.GetWorkflowInstanceAsync(instanceId));

        workflow.MapGet("{id}/instances",
            [EndpointSummary("获取工作流实例列表"), EndpointDescription("获取工作流实例列表")]
            async (IWorkflowService service, long id, long? status) =>
                await service.GetWorkflowInstancesAsync(id,
                    status.HasValue ? (WorkflowInstanceStatusEnum)status.Value : null));

        workflow.MapPut("instance/{instanceId}/suspend",
            [EndpointSummary("暂停工作流实例"), EndpointDescription("暂停工作流实例")]
            async (IWorkflowService service, string instanceId) =>
                await service.SuspendWorkflowInstanceAsync(instanceId));

        workflow.MapPut("instance/{instanceId}/resume",
            [EndpointSummary("恢复工作流实例"), EndpointDescription("恢复工作流实例")]
            async (IWorkflowService service, string instanceId) =>
                await service.ResumeWorkflowInstanceAsync(instanceId));

        workflow.MapPut("instance/{instanceId}/cancel",
            [EndpointSummary("取消工作流实例"), EndpointDescription("取消工作流实例")]
            async (IWorkflowService service, string instanceId) =>
                await service.CancelWorkflowInstanceAsync(instanceId));

        return endpoint;
    }
}