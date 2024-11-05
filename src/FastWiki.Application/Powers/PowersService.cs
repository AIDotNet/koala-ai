using FastWiki.Application.Contract.Powers;
using FastWiki.Application.Contract.Powers.Dto;
using FastWiki.Application.Contract.Powers.Input;
using FastWiki.Domain.Powers.Aggregates;
using MapsterMapper;

namespace FastWiki.Application.Powers;

public class PowersService(IRoleRepository roleRepository, IMapper mapper) : IPowersService, IScopeDependency
{
    public async Task CreateRoleAsync(RoleInput input)
    {
        var role = new Role(input.Name, input.Description, input.Code);

        await roleRepository.CreateAsync(role);
    }

    public async Task UpdateRoleAsync(string id, RoleInput input)
    {
        var role = await roleRepository.SingleOrDefaultAsync(r => r.Id == id.ToString());
        if (role == null)
        {
            throw new UserFriendlyException("角色不存在");
        }

        role.SetName(input.Name);
        role.SetDescription(input.Description);
        role.SetCode(input.Code);

        await roleRepository.UpdateAsync(role);
    }

    public async Task DeleteRoleAsync(string id)
    {
        var role = await roleRepository.SingleOrDefaultAsync(r => r.Id == id.ToString());
        if (role == null)
        {
            throw new UserFriendlyException("角色不存在");
        }

        await roleRepository.DeleteAsync(role);
    }

    public async Task<List<RoleDto>> GetRolesAsync()
    {
        var roles = await roleRepository.ListAsync();

        var result = mapper.Map<List<RoleDto>>(roles);

        return result;
    }

    public async Task BindUserRoleAsync(string userId, List<string> roleIds)
    {
        await roleRepository.DeleteUserRolesAsync(userId);

        await roleRepository.BindUserRoleAsync(userId, roleIds);
    }

    public async Task<List<RoleDto>> GetUserRolesAsync(string userId)
    {
        var roles = roleRepository.GetRolesAsync(userId);

        var result = mapper.Map<List<RoleDto>>(await roles);

        return result;
    }
}