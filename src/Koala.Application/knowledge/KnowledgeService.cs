using Koala.Application.Contract.knowledge;
using Koala.Application.Contract.knowledge.Dto;
using Koala.Application.Contract.WorkSpaces;
using Koala.Core;
using Koala.Domain.Knowledge.Aggregates;
using Koala.Domain.Knowledge.Repositories;
using MapsterMapper;

namespace Koala.Application.knowledge;

public sealed class KnowledgeService(
    IKnowledgeRepository knowledgeRepository,
    IMapper mapper,
    IUserContext userContext,
    IWorkSpacesService workSpacesService) : IKnowledgeService, IScopeDependency
{
    public async Task<PagedResultDto<KnowledgeDto>> GetListAsync(long workspaceId, int page, int pageSize,
        string? keyword)
    {
        var result =
            await knowledgeRepository.PageListAsync(page, pageSize,
                x => x.WorkspaceId == workspaceId && x.Creator == userContext.UserId &&
                     (string.IsNullOrWhiteSpace(keyword) || x.Name.Contains(keyword)));

        var count = await knowledgeRepository.CountAsync(x =>
            x.WorkspaceId == workspaceId && x.Creator == userContext.UserId &&
            (string.IsNullOrWhiteSpace(keyword) || x.Name.Contains(keyword)));

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
        if (input.WorkspaceId == null)
        {
            throw new UserFriendlyException("工作空间不存在");
        }

        if (!await workSpacesService.ExistAsync(input.WorkspaceId))
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

        var knowledge = new KoalaKnowledge(input.Name, input.Description, input.Avatar, input.EmbeddingModel,
            input.ChatModel, input.CategoryId);

        knowledge.WorkspaceId = input.WorkspaceId;

        await knowledgeRepository.AddAsync(knowledge);

        await knowledgeRepository.SaveChangesAsync();
    }

    public async Task UpdateAsync(string id, CreateKnowledge input)
    {
        var knowledge = await knowledgeRepository.FirstOrDefaultAsync(x => x.Id == id && x.Creator == userContext.UserId);

        if (knowledge == null)
        {
            throw new UserFriendlyException("知识库不存在");
        }

        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new UserFriendlyException("知识库名称不能为空");
        }

        if (string.IsNullOrWhiteSpace(input.Description))
        {
            throw new UserFriendlyException("知识库描述不能为空");
        }

        knowledge.SetName(input.Name);
        knowledge.SetDescription(input.Description);
        knowledge.SetAvatar(input.Avatar);
        knowledge.SetChatModel(input.ChatModel);

        await knowledgeRepository.SaveChangesAsync();
    }
}