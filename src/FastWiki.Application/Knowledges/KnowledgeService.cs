using FastWiki.Application.Contract.Knowledges;
using FastWiki.Application.Contract.Knowledges.Dto;
using FastWiki.Core;
using FastWiki.Domain.Knowledges.Repositories;
using MapsterMapper;

namespace FastWiki.Application.Knowledges;

public sealed class KnowledgeService(IKnowledgeRepository knowledgeRepository, IMapper mapper, IUserContext userContext) : IKnowledgeService, IScopeDependency
{
    public async Task<PagedResultDto<KnowledgeDto>> GetListAsync(long workspaceId, int page, int pageSize,
        string? keyword)
    {
        var result = await knowledgeRepository.ListAsync(x => x.WorkSpaceId == workspaceId && x.Creator == userContext.UserId);

        var count = await knowledgeRepository.CountAsync(x => x.WorkSpaceId == workspaceId && x.Creator == userContext.UserId);

        return new PagedResultDto<KnowledgeDto>(count, mapper.Map<List<KnowledgeDto>>(result));
    }

    public async Task<KnowledgeDto> GetAsync(string id)
    {
        var dto = await knowledgeRepository.FirstOrDefaultAsync(x => x.Id == id && x.Creator == userContext.UserId);

        return mapper.Map<KnowledgeDto>(dto);
    }

    public async Task DeleteAsync(string id)
    {
        await knowledgeRepository.DeleteAsync(x => x.Id == id && x.Creator == userContext.UserId);
    }
}