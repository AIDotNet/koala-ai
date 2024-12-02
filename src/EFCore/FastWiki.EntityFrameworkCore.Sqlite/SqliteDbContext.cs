using FastWiki.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Sqlite;

public class SqliteDbContext(DbContextOptions<SqliteDbContext> options, IServiceProvider serviceProvider)
    : FastWikiContext<SqliteDbContext>(options, serviceProvider)
{
}