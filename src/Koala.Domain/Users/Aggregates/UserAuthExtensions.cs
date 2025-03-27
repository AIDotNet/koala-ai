using Koala.Data.Aggregates;

namespace Koala.Domain.Users.Aggregates;

public class UserAuthExtensions : Entity<string>
{
    public string UserId { get; private set; } = null!;

    public string AuthId { get; private set; } = null!;

    public string AuthType { get; private set; } = null!;
    
    public Dictionary<string,string> ExtendData { get; set; } = new Dictionary<string, string>();

    public User User { get; set; }

    public UserAuthExtensions(string userId, string authId, string authType)
    {
        UserId = userId;
        AuthId = authId;
        AuthType = authType;
    }

    protected UserAuthExtensions()
    {
    }
}