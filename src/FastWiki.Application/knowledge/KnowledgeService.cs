using FastWiki.Application.Contract.knowledge;
using FastWiki.Application.Contract.knowledge.Dto;
using FastWiki.Application.Contract.WorkSpaces;
using FastWiki.Core;
using FastWiki.Domain.Knowledges.Aggregates;
using FastWiki.Domain.Knowledges.Repositories;
using MapsterMapper;

namespace FastWiki.Application.knowledge;

public sealed class KnowledgeService(IKnowledgeRepository knowledgeRepository,
    IMapper mapper,
    IUserContext userContext,
    IWorkSpacesService workSpacesService) : IKnowledgeService, IScopeDependency
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

    public async Task CreateAsync(CreateKnowledge input)
    {
        if (input.WorkSpaceId == null)
        {
            throw new UserFriendlyException("工作空间不存在");
        }

        if (!await workSpacesService.ExistAsync(input.WorkSpaceId.Value))
        {
            throw new UserFriendlyException("工作空间不存在");
        }

        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new UserFriendlyException("知识库名称不能为空");
        }

        if (string.IsNullOrWhiteSpace(input.Description))
        {
            throw new UserFriendlyException("知识库描述不能为空");
        }

        var knowledge = new Knowledge(input.Name, input.Description, input.Avatar, input.EmbeddingModel, input.ChatModel, input.CategoryId);

        await knowledgeRepository.AddAsync(knowledge);

        await knowledgeRepository.SaveChangesAsync();
    }
}