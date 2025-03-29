using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Domain.WorkFlows.Interfaces;

/// <summary>
/// 工作流接口，用于实现WorkflowCore的IWorkflow接口
/// </summary>
public interface IWorkflow : WorkflowCore.Interface.IWorkflow
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    new string Id { get; }

    /// <summary>
    /// 工作流版本
    /// </summary>
    new int Version { get; }

    /// <summary>
    /// 构建工作流
    /// </summary>
    /// <param name="builder">工作流构建器</param>
    new void Build(IWorkflowBuilder<object> builder);
}

/// <summary>
/// 泛型工作流接口，用于实现WorkflowCore的IWorkflow泛型接口
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public interface IWorkflow<TData> : WorkflowCore.Interface.IWorkflow<TData> where TData : new()
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    new string Id { get; }

    /// <summary>
    /// 工作流版本
    /// </summary>
    new int Version { get; }

    /// <summary>
    /// 构建工作流
    /// </summary>
    /// <param name="builder">工作流构建器</param>
    new void Build(IWorkflowBuilder<TData> builder);
}
