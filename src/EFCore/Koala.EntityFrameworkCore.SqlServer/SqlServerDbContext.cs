using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.SqlServer;

public class SqlServerDbContext(DbContextOptions<SqlServerDbContext> options, IServiceProvider serviceProvider)
    : KoalaContext<SqlServerDbContext>(options, serviceProvider)
{
}