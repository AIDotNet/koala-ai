FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Koala.HttpApi.Host/Koala.HttpApi.Host.csproj", "src/Koala.HttpApi.Host/"]
COPY ["src/EFCore/Koala.EntityFrameworkCore.PostgreSql/Koala.EntityFrameworkCore.PostgreSql.csproj", "src/EFCore/Koala.EntityFrameworkCore.PostgreSql/"]
COPY ["src/Koala.EntityFrameworkCore/Koala.EntityFrameworkCore.csproj", "src/Koala.EntityFrameworkCore/"]
COPY ["src/Koala.Domain/Koala.Domain.csproj", "src/Koala.Domain/"]
COPY ["src/Koala.Core/Koala.Core.csproj", "src/Koala.Core/"]
COPY ["src/Koala.Data/Koala.Data.csproj", "src/Koala.Data/"]
COPY ["src/Koala.Domain.Shared/Koala.Domain.Shared.csproj", "src/Koala.Domain.Shared/"]
COPY ["src/EFCore/Koala.EntityFrameworkCore.Sqlite/Koala.EntityFrameworkCore.Sqlite.csproj", "src/EFCore/Koala.EntityFrameworkCore.Sqlite/"]
COPY ["src/EFCore/Koala.EntityFrameworkCore.SqlServer/Koala.EntityFrameworkCore.SqlServer.csproj", "src/EFCore/Koala.EntityFrameworkCore.SqlServer/"]
COPY ["src/Koala.HttpApi/Koala.HttpApi.csproj", "src/Koala.HttpApi/"]
COPY ["src/Koala.Application/Koala.Application.csproj", "src/Koala.Application/"]
COPY ["src/Koala.Application.Contract/Koala.Application.Contract.csproj", "src/Koala.Application.Contract/"]
COPY ["src/framework/Koala.Jwt/Koala.Jwt.csproj", "src/framework/Koala.Jwt/"]
RUN dotnet restore "src/Koala.HttpApi.Host/Koala.HttpApi.Host.csproj"
COPY . .
WORKDIR "/src/src/Koala.HttpApi.Host"
RUN dotnet build "Koala.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Koala.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Koala.HttpApi.Host.dll"]
