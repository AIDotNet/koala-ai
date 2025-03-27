using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.EntityFrameworkCore.SqlServer;

public static class SqlServerEntityFrameworkCoreExtensions
{
    public static IServiceCollection AddSqlServerDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SqlServerDbContext>((builder =>
        {
            builder.UseSqlServer(configuration.GetConnectionString("Default"));
        }));

        services.AddKoalaDbContext();
        
        services.AddScoped<IContext, SqlServerDbContext>();

        return services;
    }
}