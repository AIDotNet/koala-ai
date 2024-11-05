namespace FastWiki.Core.Model;

/// <summary>
/// 分页模型
/// </summary>
/// <typeparam name="TEntity"></typeparam>
public class PagedResultDto<TEntity> where TEntity : class
{
    public int Total { get; set; }

    public IReadOnlyList<TEntity> Data { get; set; }

    public PagedResultDto(int total, IReadOnlyList<TEntity> data)
    {
        Total = total;
        Data = data;
    }
}