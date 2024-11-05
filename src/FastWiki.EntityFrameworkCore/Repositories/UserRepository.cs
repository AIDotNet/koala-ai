using FastWiki.Domain.Users.Aggregates;
using FastWiki.Domain.Users.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class UserRepository(IContext context) : Repository<User>(context),IUserRepository
{
    public async Task<User> GetAsync(string userName)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Account == userName);
    }

    public async Task<User> GetAsync(Guid id)
    {
        return await context.Users.FindAsync(id.ToString());
    }

    public async Task<User> CreateAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }

    public async Task<List<User>> GetListAsync(string? keyword, int page, int pageSize)
    {
        var query = context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(u => u.Account.Contains(keyword) || u.Name.Contains(keyword));
        }

        return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public Task<int> GetCountAsync(string? keyword)
    {
        var query = context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(u => u.Account.Contains(keyword) || u.Name.Contains(keyword));
        }

        return query.CountAsync();
    }

    public async Task<User> GetByUserNameAsync(string userName)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Account == userName);
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> GetByPhoneAsync(string phone)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Phone == phone);
    }

    public async Task<User> GetByUserNameOrEmailOrPhoneAsync(string userName, string email, string phone)
    {
        return await context.Users.FirstOrDefaultAsync(u =>
            u.Account == userName || u.Email == email || u.Phone == phone);
    }
}