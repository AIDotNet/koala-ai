using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Redis;
using Microsoft.SemanticKernel.Connectors.Weaviate;
using Npgsql;
using StackExchange.Redis;

namespace Koala_Memory;

public static class ServiceExtensions
{
    
    public static IServiceCollection AddInMemoryKoalaMemory(this IServiceCollection service)
    {
        service.AddInMemoryVectorStore();

        return service;
    }

    public static IServiceCollection AddWeaviateKoalaMemory(this IServiceCollection service, string apiKey,
        string connectionsString)
    {
        service.AddWeaviateVectorStore(options: new WeaviateVectorStoreOptions()
        {
            Endpoint = new Uri(connectionsString),
            ApiKey = apiKey
        });

        return service;
    }

    public static IServiceCollection AddRedisKoalaMemory(this IServiceCollection service, string connectionsString)
    {
        service.AddSingleton<IDatabase>(sp => ConnectionMultiplexer.Connect(connectionsString).GetDatabase());

        service.AddRedisVectorStore(options: new RedisVectorStoreOptions()
        {
            StorageType = RedisStorageType.Json
        });

        return service;
    }

    public static IServiceCollection AddSqliteKoalaMemory(this IServiceCollection service, string connectionsString,
        string vectorName)
    {
        service.AddSingleton<SqliteConnection>(sp =>
        {
            var connection = new SqliteConnection(connectionsString);

            connection.LoadExtension(vectorName);

            return connection;
        });

        service.AddSqliteVectorStore();


        return service;
    }

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