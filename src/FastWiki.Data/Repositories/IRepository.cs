using System.Linq.Expressions;

namespace FastWiki.Data.Repositories;

public interface IRepository<TEntity> where TEntity : class
{
    Task<List<TEntity>> ListAsync(CancellationToken cancellationToken = default);

    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);

    Task<int> CountAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);

    Task<List<TEntity>> ListAsync(Expression<Func<TEntity, bool>> expression,
        CancellationToken cancellationToken = default);

    Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> expression,
        CancellationToken cancellationToken = default);

    Task<TEntity> FirstAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);

    Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> expression,
        CancellationToken cancellationToken = default);

    Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> expression,
        CancellationToken cancellationToken = default);

    Task<TEntity> LastOrDefaultAsync(Expression<Func<TEntity, bool>> expression,
        CancellationToken cancellationToken = default);

    Task<TEntity> LastAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);

    Task DeleteAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);
}