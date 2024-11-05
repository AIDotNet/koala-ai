using FastWiki.Domain.Powers.Repositories;
using FastWiki.Domain.Users.Repositories;
using FastWiki.EntityFrameworkCore.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace FastWiki.EntityFrameworkCore;

public static class ServiceExtensions
{
    public static IServiceCollection AddFastWikiDbContext(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();

        return services;
    }
}