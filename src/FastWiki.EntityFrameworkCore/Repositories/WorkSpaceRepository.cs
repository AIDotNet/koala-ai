using System.Linq.Expressions;
using FastWiki.Domain.WorkSpace.Repositories;
using FastWiki.Domain.WorkSpaces.Aggregates;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class WorkSpaceRepository(IContext context) : Repository<WorkSpace>(context),IWorkSpaceRepository
{
    public async Task CreateAsync(WorkSpace workSpace)
    {
        await context.WorkSpaces.AddAsync(workSpace);

        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long id)
    {
        await context.WorkSpaces.Where(x => x.Id == id)
            .ExecuteDeleteAsync();
    }

    public async Task UpdateAsync(WorkSpace workSpace)
    {
        context.WorkSpaces.Update(workSpace);

        await context.SaveChangesAsync();
    }

    public Task<List<WorkSpace>> GetListAsync(string userId)
    {
        var query = context.WorkSpaceMembers
            .Where(x => x.UserId == userId)
            .Include(x => x.WorkSpace)
            .Select(x => x.WorkSpace);

        return query.ToListAsync();
    }

    public Task<bool> AnyAsync(Expression<Func<WorkSpace, bool>> expression)
    {
        return context.WorkSpaces.AnyAsync(expression);
    }
}