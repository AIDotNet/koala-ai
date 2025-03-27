using System.Security.Claims;
using Koala.Core;

namespace Koala.HttpApi;

public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public string UserId
    {
        get
        {
            var identifier = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            return identifier ?? string.Empty;
        }
    }

    public string UserName
    {
        get
        {
            var name = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);

            return name ?? string.Empty;
        }
    }

    public bool IsAuthenticated
    {
        get { return httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false; }
    }

    public string[] Roles
    {
        get
        {
            var role = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role)?.Split(',');

            return role ?? Array.Empty<string>();
        }
    }
}