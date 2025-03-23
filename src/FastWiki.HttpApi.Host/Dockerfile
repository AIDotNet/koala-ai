FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/FastWiki.HttpApi.Host/FastWiki.HttpApi.Host.csproj", "src/FastWiki.HttpApi.Host/"]
COPY ["src/EFCore/FastWiki.EntityFrameworkCore.PostgreSql/FastWiki.EntityFrameworkCore.PostgreSql.csproj", "src/EFCore/FastWiki.EntityFrameworkCore.PostgreSql/"]
COPY ["src/FastWiki.EntityFrameworkCore/FastWiki.EntityFrameworkCore.csproj", "src/FastWiki.EntityFrameworkCore/"]
COPY ["src/FastWiki.Domain/FastWiki.Domain.csproj", "src/FastWiki.Domain/"]
COPY ["src/FastWiki.Core/FastWiki.Core.csproj", "src/FastWiki.Core/"]
COPY ["src/FastWiki.Data/FastWiki.Data.csproj", "src/FastWiki.Data/"]
COPY ["src/FastWiki.Domain.Shared/FastWiki.Domain.Shared.csproj", "src/FastWiki.Domain.Shared/"]
COPY ["src/EFCore/FastWiki.EntityFrameworkCore.Sqlite/FastWiki.EntityFrameworkCore.Sqlite.csproj", "src/EFCore/FastWiki.EntityFrameworkCore.Sqlite/"]
COPY ["src/EFCore/FastWiki.EntityFrameworkCore.SqlServer/FastWiki.EntityFrameworkCore.SqlServer.csproj", "src/EFCore/FastWiki.EntityFrameworkCore.SqlServer/"]
COPY ["src/FastWiki.HttpApi/FastWiki.HttpApi.csproj", "src/FastWiki.HttpApi/"]
COPY ["src/FastWiki.Application/FastWiki.Application.csproj", "src/FastWiki.Application/"]
COPY ["src/FastWiki.Application.Contract/FastWiki.Application.Contract.csproj", "src/FastWiki.Application.Contract/"]
COPY ["src/framework/FastWiki.Jwt/FastWiki.Jwt.csproj", "src/framework/FastWiki.Jwt/"]
RUN dotnet restore "src/FastWiki.HttpApi.Host/FastWiki.HttpApi.Host.csproj"
COPY . .
WORKDIR "/src/src/FastWiki.HttpApi.Host"
RUN dotnet build "FastWiki.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "FastWiki.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FastWiki.HttpApi.Host.dll"]
