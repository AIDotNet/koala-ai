using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Npgsql;

namespace Koala_Memory;

public static class ServiceExtensions
{
    public static IServiceCollection AddPostgresKoalaMemory(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton<NpgsqlDataSource>(sp =>
        {
            NpgsqlDataSourceBuilder dataSourceBuilder =
                new(connectionString);
            dataSourceBuilder.UseVector();
            return dataSourceBuilder.Build();
        });

        services.AddPostgresVectorStore();

        return services;
    }
}