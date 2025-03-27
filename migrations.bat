@echo off
set MIGRATION_NAME=InitialCreate

set DbType=postgresql
dotnet ef migrations add --project src\EFCore\Koala.EntityFrameworkCore.PostgreSql\Koala.EntityFrameworkCore.PostgreSql.csproj --startup-project src\Koala.HttpApi.Host\Koala.HttpApi.Host.csproj --context Koala.EntityFrameworkCore.PostgreSql.PostgreSqlDbContext --configuration Debug  %MIGRATION_NAME%  --output-dir Migrations\

set DbType=sqlserver
dotnet  ef migrations add --project src\EFCore\Koala.EntityFrameworkCore.SqlServer\Koala.EntityFrameworkCore.SqlServer.csproj --startup-project src\Koala.HttpApi.Host\Koala.HttpApi.Host.csproj --context Koala.EntityFrameworkCore.SqlServer.SqlServerDbContext --configuration Debug --verbose %MIGRATION_NAME% --output-dir Migrations\

set DbType=sqlite
dotnet ef migrations add --project src\EFCore\Koala.EntityFrameworkCore.Sqlite\Koala.EntityFrameworkCore.Sqlite.csproj --startup-project src\Koala.HttpApi.Host\Koala.HttpApi.Host.csproj --context Koala.EntityFrameworkCore.Sqlite.SqliteDbContext  --configuration Debug --verbose %MIGRATION_NAME% --output-dir Migrations\
