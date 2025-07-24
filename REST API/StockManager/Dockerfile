# run from VS
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# project compile service
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# copy solution files
COPY Directory.Build.props .
COPY Directory.Packages.props .

# copy projects
COPY StockManager/. ./StockManager/
COPY StockManager.Application/. ./StockManager.Application/
COPY StockManager.Infrastructure/. ./StockManager.Infrastructure/
COPY StockManager.Core.Domain/. ./StockManager.Core.Domain/

# restore dependencies
RUN dotnet restore "./StockManager/StockManager.csproj"

# build application
WORKDIR "/src/StockManager"
RUN dotnet build "./StockManager.csproj" -c $BUILD_CONFIGURATION -o /app/build /p:BuildingInsideDocker=true

# build application tests
FROM build AS test
WORKDIR /src
COPY ["Tests/StockManager.Application.Tests/StockManager.Application.Tests.csproj", "StockManager.Application.Tests/"]
COPY ./Tests/StockManager.Application.Tests ./StockManager.Application.Tests
RUN dotnet test "StockManager.Application.Tests/StockManager.Application.Tests.csproj" --no-restore --verbosity normal

# This stage is used to publish the service design to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src/StockManager
RUN dotnet publish "StockManager.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false /p:BuildingInsideDocker=true

COPY StockManager/appsettings.json /app/publish/
COPY StockManager/appsettings.Development.json /app/publish/

RUN ls -la /app/publish

# This stage is used in production environment or when running from VS in regular mode (default when not using debug configuration)
FROM base AS final
ARG APP_UID=1000

WORKDIR /app
COPY --from=publish /app/publish .

# for debugging
RUN ls -la /app

USER root
RUN apt-get update && apt-get install -y curl && \
    useradd -u $APP_UID -m appuser

USER appuser

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "StockManager.dll"]