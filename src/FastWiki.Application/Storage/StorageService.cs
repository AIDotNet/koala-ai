using FastWiki.Application.Contract.Storage;
using FastWiki.Application.Contract.Storage.Dto;
using FastWiki.Core;
using FastWiki.Domain.Storage;
using FastWiki.Domain.Storage.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace FastWiki.Application.Storage;

public sealed class StorageService(
    IFileStorageRepository fileStorageRepository,
    IConfiguration configuration,
    IWebHostEnvironment webHostEnvironment,
    IUserContext userContext,
    IHttpContextAccessor httpContextAccessor) : IStorageService, IScopeDependency
{
    public async Task<UploadDto> UploadAsync(Stream stream, string fileName, string contentType)
    {
        var app = configuration["App"];

        if (string.IsNullOrEmpty(app))
        {
            // 读取请求域名
            var host = httpContextAccessor.HttpContext.Request.Host.Host;
            var port = httpContextAccessor.HttpContext.Request.Host.Port;
            var scheme = httpContextAccessor.HttpContext.Request.Scheme;
            app = $"{scheme}://{host}:{port}";
        }

        app = app.Trim('/');

        // 组合文件名
        var file = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";

        // 上传文件
        var path = Path.Combine(webHostEnvironment.WebRootPath, "storage", file);

        var fileInfo = new FileInfo(path);
        if (fileInfo.Directory?.Exists == true)
        {
            fileInfo.Directory.Create();
        }

        await using var fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true);
        await stream.CopyToAsync(fs);

        var url = $"{app}/storage/{file}";

        var storage = new FileStorage(fileName, path, fs.Length, contentType, url);
        // 保存文件信息
        await fileStorageRepository.AddAsync(storage);

        return new UploadDto
        {
            Id = storage.Id,
            Url = url
        };
    }

    public async Task<Stream> DownloadAsync(string id)
    {
        var storage = await fileStorageRepository.FirstOrDefaultAsync(x => x.Id == id);

        if (storage == null)
        {
            throw new ArgumentException("文件不存在");
        }

        return new FileStream(storage.FullName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, true);
    }

    public async Task DeleteAsync(string id)
    {
        // 先查询文件信息
        var storage =
            await fileStorageRepository.FirstOrDefaultAsync(x => x.Id == id && x.Creator == userContext.UserId);

        if (storage == null)
        {
            throw new ArgumentException("文件不存在");
        }

        // 删除文件
        if (File.Exists(storage.FullName))
        {
            File.Delete(storage.FullName);
        }

        // 删除文件信息
        await fileStorageRepository.DeleteAsync(storage);
    }
}