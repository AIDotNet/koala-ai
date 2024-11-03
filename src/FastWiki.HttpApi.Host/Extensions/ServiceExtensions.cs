using FastWiki.HttpApi.Extensions;

namespace FastWiki.HttpApi.Host.Extensions;

public static class ServiceExtensions
{
    private const string CorsPolicy = "CorsPolicy";

    public static IServiceCollection AddFastWiki(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAutoGnarly();
        services.AddHttpApi();

        services.AddResponseCompression();

        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicy, builder =>
            {
                builder.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .AllowAnyOrigin();
            });
        });

        var dbType = configuration["DbType"];
        if (dbType.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
        {
            services.AddSqliteDatabase(configuration);
        }
        else if (dbType.Equals("PostgreSql", StringComparison.OrdinalIgnoreCase))
        {
            services.AddPostgreSqlDatabase(configuration);
        }
        else if (dbType.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
        {
            services.AddSqlServerDatabase(configuration);
        }
        else
        {
            services.AddSqliteDatabase(configuration);
        }


        return services;
    }

    public static IApplicationBuilder UseFastWiki(this IApplicationBuilder builder)
    {
        builder.UseHttpApi();

        builder.UseAuthentication();
        builder.UseAuthorization();

        builder.UseStaticFiles();

        builder.UseResponseCompression();

        builder.UseCors(CorsPolicy);

        return builder;
    }
}