@echo off
set MIGRATION_NAME=InitialCreate

set DbType=postgresql
dotnet ef migrations add --project src\EFCore\FastWiki.EntityFrameworkCore.PostgreSql\FastWiki.EntityFrameworkCore.PostgreSql.csproj --startup-project src\FastWiki.HttpApi.Host\FastWiki.HttpApi.Host.csproj --context FastWiki.EntityFrameworkCore.PostgreSql.PostgreSqlDbContext --configuration Debug  %MIGRATION_NAME%  --output-dir Migrations\

set DbType=sqlserver
dotnet  ef migrations add --project src\EFCore\FastWiki.EntityFrameworkCore.SqlServer\FastWiki.EntityFrameworkCore.SqlServer.csproj --startup-project src\FastWiki.HttpApi.Host\FastWiki.HttpApi.Host.csproj --context FastWiki.EntityFrameworkCore.SqlServer.SqlServerDbContext --configuration Debug --verbose %MIGRATION_NAME% --output-dir Migrations\

set DbType=sqlite
dotnet ef migrations add --project src\EFCore\FastWiki.EntityFrameworkCore.Sqlite\FastWiki.EntityFrameworkCore.Sqlite.csproj --startup-project src\FastWiki.HttpApi.Host\FastWiki.HttpApi.Host.csproj --context FastWiki.EntityFrameworkCore.Sqlite.SqliteDbContext  --configuration Debug --verbose %MIGRATION_NAME% --output-dir Migrations\
