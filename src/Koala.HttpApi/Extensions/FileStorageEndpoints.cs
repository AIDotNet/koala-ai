using Koala.Application.Contract.Storage;
using Koala.Application.Contract.Storage.Dto;
using Koala.HttpApi.Filter;

namespace Koala.HttpApi.Extensions;

public static class FileStorageEndpoints
{
    public static IEndpointRouteBuilder MapStorageEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var storage = endpoint.MapGroup("/api/v1/storage")
            .WithTags("文件管理")
            .AddEndpointFilter<ResultFilter>();

        storage.MapPost("/upload", async (IStorageService service, UploadDto input, HttpContext context) =>
        {
            var file = context.Request.Form.Files.First();
            var stream = file.OpenReadStream();
            return await service.UploadAsync(stream, file.FileName, file.ContentType);
        });

        storage.MapGet("/{id}", async (IStorageService service, string id) =>
        {
            var stream = await service.DownloadAsync(id);
            return stream;
        });
        
        storage.MapDelete("/{id}", async (IStorageService service, string id) =>
        {
            await service.DeleteAsync(id);
        });
        
        return endpoint;
    }
}