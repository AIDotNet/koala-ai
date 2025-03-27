namespace Koala.Domain.Powers.Aggregates;

/// <summary>
/// 用户角色
/// </summary>
public class UserRole
{
    public string UserId { get; set; } = null!;

    public string RoleId { get; set; } = null!;

    public User User { get; set; } = null!;

    public Role Role { get; set; } = null!;

    public UserRole(string userId, string roleId)
    {
        UserId = userId;
        RoleId = roleId;
    }

    protected UserRole()
    {
    }
}