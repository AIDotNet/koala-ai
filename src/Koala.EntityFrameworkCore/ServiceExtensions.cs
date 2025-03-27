using Koala.Domain.Agents.Repositories;
using Koala.Domain.Knowledge.Repositories;
using Koala.Domain.Powers.Repositories;
using Koala.Domain.Storage.Repositories;
using Koala.Domain.Users.Repositories;
using Koala.Domain.WorkSpace.Repositories;
using Koala.EntityFrameworkCore.Repositories;
using Gnarly.Data;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.EntityFrameworkCore;

public static class ServiceExtensions
{
    public static IServiceCollection AddKoalaDbContext(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IWorkSpaceRepository, WorkSpaceRepository>();
        services.AddScoped<IAgentRepository, AgentRepository>();
        services.AddScoped<IKnowledgeRepository, KnowledgeRepository>();
        services.AddScoped<IFileStorageRepository, FileStorageRepository>();

        return services;
    }
}