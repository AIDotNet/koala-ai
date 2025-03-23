using FastWiki.Core;
using FastWiki.Domain.Users.Aggregates;
using MapsterMapper;

namespace FastWiki.Application.Users;

public class UserService(IUserRepository userRepository, IMapper mapper, IUserContext userContext)
    : IUserService, IScopeDependency
{
    public async Task<string> CreateAsync(CreateUserInput input)
    {
        var user = mapper.Map<User>(input);

        user.SetPassword(input.Password);
        user.SetEmail(input.Email);

        user = await userRepository.CreateAsync(user);

        return user.Id;
    }

    public async Task UpdateAsync(string id, UpdateUserInput input)
    {
        var user = await userRepository.GetAsync(id);
        if (user == null)
        {
            throw new UserFriendlyException("用户不存在");
        }

        user.SetEmail(input.Email);
        user.SetName(input.Name);
        user.SetIntroduction(input.Introduction);

        await userRepository.UpdateAsync(user);
    }

    public async Task DeleteAsync(string id)
    {
        var user = await userRepository.GetAsync(id);
        if (user == null)
        {
            throw new UserFriendlyException("用户不存在");
        }

        await userRepository.DeleteAsync(user);
    }

    public async Task<PagedResultDto<UserDto>> GetListAsync(string? keyword, int page, int pageSize)
    {
        var users = await userRepository.GetListAsync(keyword, page, pageSize);

        var count = await userRepository.GetCountAsync(keyword);

        return new PagedResultDto<UserDto>(count, users.Select(mapper.Map<UserDto>).ToList());
    }

    public async Task<UserDto> GetCurrentAsync()
    {
        var user = await userRepository.GetAsync(Guid.Parse(userContext.UserId));

        if (user == null)
        {
            throw new UserFriendlyException("用户不存在");
        }

        return mapper.Map<UserDto>(user);
    }
}