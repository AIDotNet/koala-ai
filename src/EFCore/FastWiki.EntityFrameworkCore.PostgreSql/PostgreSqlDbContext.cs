using FastWiki.EntityFrameworkCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.PostgreSql;

public class PostgreSqlDbContext(DbContextOptions<PostgreSqlDbContext> options) : FastWikiContext<PostgreSqlDbContext>(options)
{
    
}