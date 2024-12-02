using FastWiki.Domain.Agents.Repositories;
using FastWiki.Domain.Powers.Repositories;
using FastWiki.Domain.Users.Repositories;
using FastWiki.Domain.WorkSpace.Repositories;
using FastWiki.EntityFrameworkCore.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace FastWiki.EntityFrameworkCore;

public static class ServiceExtensions
{
    public static IServiceCollection AddFastWikiDbContext(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IWorkSpaceRepository, WorkSpaceRepository>();
        services.AddScoped<IAgentRepository, AgentRepository>();

        return services;
    }
}