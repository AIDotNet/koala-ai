using FastWiki.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FastWiki.EntityFrameworkCore.Sqlite;

public static class SqliteEntityFrameworkCoreExtensions
{
    public static IServiceCollection AddSqliteDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SqliteDbContext>((builder =>
        {
            builder.UseSqlite(configuration.GetConnectionString("Default"));
        }));
        
        services.AddFastWikiDbContext();

        services.AddScoped<IContext, SqliteDbContext>();

        return services;
    }
}