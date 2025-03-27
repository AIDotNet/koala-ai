using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.Sqlite;

public class SqliteDbContext(DbContextOptions<SqliteDbContext> options, IServiceProvider serviceProvider)
    : KoalaContext<SqliteDbContext>(options, serviceProvider)
{
}