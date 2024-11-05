using FastWiki.Domain.Powers.Aggregates;
using FastWiki.Domain.Powers.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class RoleRepository(IContext context) : IRoleRepository
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
}