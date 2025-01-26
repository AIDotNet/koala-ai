using FastWiki.Application.Contract.knowledge.Dto;
using FastWiki.Core.Model;

namespace FastWiki.Application.Contract.knowledge;

public interface IKnowledgeService
{
    /// <summary>
    /// 获取知识库列表
    /// </summary>
    /// <param name="workspaceId"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    Task<PagedResultDto<KnowledgeDto>> GetListAsync(long workspaceId, int page, int pageSize, string? keyword);

    /// <summary>
    /// 获取知识库详情
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<KnowledgeDto> GetAsync(string id);

    /// <summary>
    /// 删除知识库
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(string id);

    /// <summary>
    /// 创建知识库
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task CreateAsync(CreateKnowledge input);
}