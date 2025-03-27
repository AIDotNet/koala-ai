using Koala.Domain.Storage;
using Koala.Domain.Storage.Repositories;
using Koala.EntityFrameworkCore.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.Repositories;

/// <summary>
/// 文件存储仓储
/// </summary>
/// <param name="context"></param>
public class FileStorageRepository(IContext context) : Repository<FileStorage>(context), IFileStorageRepository
{
}