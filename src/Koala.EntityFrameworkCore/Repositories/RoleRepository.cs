using Koala.Domain.Powers.Aggregates;
using Koala.Domain.Powers.Repositories;
using Koala.EntityFrameworkCore.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.Repositories;

public class RoleRepository(IContext context) : Repository<Role>(context), IRoleRepository
{
    public async Task<List<Role>> GetRolesAsync(string userId)
    {
        return await context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Include(x => x.Role)
            .Select(ur => ur.Role)
            .ToListAsync();
    }

    public async Task<Role> CreateAsync(Role role)
    {
        context.Roles.Add(role);
        await context.SaveChangesAsync();
        return role;
    }

    public async Task<Role> UpdateAsync(Role role)
    {
        context.Roles.Update(role);
        await context.SaveChangesAsync();
        return role;
    }

    public async Task DeleteAsync(string id)
    {
        var role = await context.Roles.FindAsync(id);
        if (role != null)
        {
            context.Roles.Remove(role);
            await context.SaveChangesAsync();
        }
    }

    public async Task<List<Role>> GetListAsync(string? keyword)
    {
        return await context.Roles
            .Where(r => string.IsNullOrEmpty(keyword) || r.Name.Contains(keyword))
            .ToListAsync();
    }

    public async Task DeleteUserRolesAsync(string userId)
    {
        await context.UserRoles
            .Where(ur => ur.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public Task BindUserRoleAsync(string userId, List<string> roleIds)
    {
        var userRoles = roleIds.Select(roleId => new UserRole(userId, roleId)).ToList();
        
        context.UserRoles.AddRange(userRoles);
        
        return context.SaveChangesAsync();
    }
}