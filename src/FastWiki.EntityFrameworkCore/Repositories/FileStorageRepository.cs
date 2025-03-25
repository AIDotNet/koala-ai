using FastWiki.Domain.Storage;
using FastWiki.Domain.Storage.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

/// <summary>
/// 文件存储仓储
/// </summary>
/// <param name="context"></param>
public class FileStorageRepository(IContext context) : Repository<FileStorage>(context), IFileStorageRepository
{
}