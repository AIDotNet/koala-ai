using Koala.Data.Repositories;

namespace Koala.Domain.Users.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User> GetAsync(string userName);

    Task<User> GetAsync(Guid id);

    Task<User> CreateAsync(User user);

    Task<User> UpdateAsync(User user);

    Task DeleteAsync(User user);

    Task<List<User>> GetListAsync(string? keyword, int page, int pageSize);
    
    Task<int> GetCountAsync(string? keyword);

    Task<User> GetByUserNameAsync(string userName);

    Task<User> GetByEmailAsync(string email);

    Task<User> GetByPhoneAsync(string phone);

    Task<User> GetByUserNameOrEmailOrPhoneAsync(string userName, string email, string phone);
}