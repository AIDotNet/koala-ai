using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.EntityFrameworkCore.PostgreSql;

public static class PostgreSqlEntityFrameworkCoreExtensions
{
    public static IServiceCollection AddPostgreSqlDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<PostgreSqlDbContext>((builder =>
        {
            builder.UseNpgsql(configuration.GetConnectionString("Default"));
        }));

        services.AddKoalaDbContext();
        
        services.AddScoped<IContext, PostgreSqlDbContext>();

        return services;
    }
}