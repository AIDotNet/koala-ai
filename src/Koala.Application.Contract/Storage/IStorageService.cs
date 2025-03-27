using Koala.Application.Contract.Storage.Dto;

namespace Koala.Application.Contract.Storage;

public interface IStorageService
{
    /// <summary>
    /// 上传文件
    /// </summary>
    /// <param name="stream"></param>
    /// <param name="fileName"></param>
    /// <param name="contentType"></param>
    /// <returns></returns>
    Task<UploadDto> UploadAsync(Stream stream, string fileName, string contentType);

    /// <summary>
    /// 下载文件
    /// </summary>
    Task<Stream> DownloadAsync(string id);

    /// <summary>
    /// 删除文件
    /// </summary>
    Task DeleteAsync(string id);
}