using Koala.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.PostgreSql;

public class PostgreSqlDbContext(DbContextOptions<PostgreSqlDbContext> options, IServiceProvider serviceProvider)
    : KoalaContext<PostgreSqlDbContext>(options, serviceProvider)
{
}