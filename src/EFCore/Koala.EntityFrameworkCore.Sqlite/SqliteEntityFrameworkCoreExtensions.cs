using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.EntityFrameworkCore.Sqlite;

public static class SqliteEntityFrameworkCoreExtensions
{
    public static IServiceCollection AddSqliteDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SqliteDbContext>((builder =>
        {
            builder.UseSqlite(configuration.GetConnectionString("Default"));
        }));
        
        services.AddKoalaDbContext();

        services.AddScoped<IContext, SqliteDbContext>();

        return services;
    }
}