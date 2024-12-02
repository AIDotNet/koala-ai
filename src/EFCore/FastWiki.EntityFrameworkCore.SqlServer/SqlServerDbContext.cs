using FastWiki.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.SqlServer;

public class SqlServerDbContext(DbContextOptions<SqlServerDbContext> options, IServiceProvider serviceProvider)
    : FastWikiContext<SqlServerDbContext>(options, serviceProvider)
{
}