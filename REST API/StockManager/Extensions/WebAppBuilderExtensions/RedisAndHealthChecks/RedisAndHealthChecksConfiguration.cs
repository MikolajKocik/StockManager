using StackExchange.Redis;

namespace StockManager.Extensions.WebAppBuilderExtensions.RedisAndHealthChecks;

internal static class RedisAndHealthChecksConfiguration
{
    public static void AddConfigurations(WebApplicationBuilder builder)
    {
        // Redis
        string redisHost = Environment.GetEnvironmentVariable("REDIS_HOST")!;
        string redisPort = Environment.GetEnvironmentVariable("REDIS_PORT")!;

        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = $"{redisHost}:{redisPort}";
            options.InstanceName = "MyAppCache:";
        });

        builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            try
            {
                return ConnectionMultiplexer.Connect($"{redisHost}:{redisPort}");
            }
            catch (RedisConnectionException ex)
            {
                throw new InvalidOperationException("Could not connect to Redis", ex);
            }
        });

        // health checks
        string sqlConn = Environment.GetEnvironmentVariable("ConnectionStrings__DockerConnection")
                      ?? throw new ArgumentException("Empty variable ConnectionStrings__DockerConnection");

        builder.Services.AddHealthChecks()
            .AddRedis($"{redisHost}:{redisPort}", name: HealthCheckNames.Redis)
            .AddSqlServer(sqlConn, name: HealthCheckNames.SqlServer);
    }
}
