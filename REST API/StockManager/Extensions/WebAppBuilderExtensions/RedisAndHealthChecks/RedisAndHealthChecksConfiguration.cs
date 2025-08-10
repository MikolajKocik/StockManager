using StackExchange.Redis;

namespace StockManager.Extensions.WebAppBuilderExtensions.RedisAndHealthChecks;

internal static class RedisAndHealthChecksConfiguration
{
    public static void AddConfigurations(WebApplicationBuilder builder)
    {
        // Redis
        string redisHost = builder.Configuration["redis-host"]!;
        string redisPort = builder.Configuration["redis-port"]!;

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
        string sqlConn = builder.Configuration["ConnectionStrings-DockerConnection"]
                      ?? throw new ArgumentException("Empty variable ConnectionStrings-DockerConnection");

        builder.Services.AddHealthChecks()
            .AddRedis($"{redisHost}:{redisPort}", name: HealthCheckNames.Redis)
            .AddSqlServer(sqlConn, name: HealthCheckNames.SqlServer);
    }
}
