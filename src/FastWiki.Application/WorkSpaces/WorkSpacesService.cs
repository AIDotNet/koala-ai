using FastWiki.Application.Contract.WorkSpaces;
using FastWiki.Application.Contract.WorkSpaces.Dto;
using FastWiki.Application.Contract.WorkSpaces.Input;
using FastWiki.Core;
using FastWiki.Domain.WorkSpace.Repositories;
using FastWiki.Domain.WorkSpaces.Aggregates;
using MapsterMapper;

namespace FastWiki.Application.WorkSpaces;

public class WorkSpacesService(IWorkSpaceRepository workSpaceRepository, IUserContext userContext, IMapper mapper)
    : IWorkSpacesService, IScopeDependency
{
    public async Task CreateAsync(WorkSpacesInput workSpacesDto)
    {
        // 创造工作空间限制
        if (await workSpaceRepository.AnyAsync(x => x.Name == workSpacesDto.Name && x.Creator == userContext.UserId))
        {
            throw new UserFriendlyException("工作空间名称已存在");
        }

        // 创造工作空间数量限制
        if (await workSpaceRepository.CountAsync(x => x.Creator == userContext.UserId) >= 5)
        {
            throw new UserFriendlyException("工作空间数量已达上限");
        }
        var workSpace = new WorkSpace(workSpacesDto.Name, workSpacesDto.Description);

        await workSpaceRepository.CreateAsync(workSpace);
    }

    public async Task UpdateAsync(long id, WorkSpacesInput workSpacesDto)
    {
        var workSpace = await workSpaceRepository.FirstAsync(x => x.Id == id && x.Creator == userContext.UserId);
        if (workSpace != null)
        {
            workSpace.SetName(workSpacesDto.Name);
            workSpace.SetDescription(workSpacesDto.Description);
            await workSpaceRepository.UpdateAsync(workSpace);
        }
    }

    public async Task DeleteAsync(long workSpaceId)
    {
        // 至少保留一个工作空间，
        if (await workSpaceRepository.CountAsync(x => x.Creator == userContext.UserId) <= 1)
        {
            throw new UserFriendlyException("至少保留一个工作空间");
        }

        await workSpaceRepository.DeleteAsync(workSpaceId);
    }

    public async Task<List<WorkSpaceDto>> GetAsync()
    {
        var workSpaces = await workSpaceRepository.GetListAsync(userContext.UserId);

        var result = mapper.Map<List<WorkSpaceDto>>(workSpaces);

        return result;
    }

    public async Task<bool> ExistAsync(long id)
    {
        return await workSpaceRepository.AnyAsync(x => x.Id == id && x.Creator == userContext.UserId);
    }
}