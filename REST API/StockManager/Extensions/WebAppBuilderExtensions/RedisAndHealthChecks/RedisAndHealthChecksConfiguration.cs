using StackExchange.Redis;

namespace StockManager.Extensions.WebAppBuilderExtensions.RedisAndHealthChecks;

internal static class RedisAndHealthChecksConfiguration
{
    public static void AddConfigurations(WebApplicationBuilder builder)
    {  
        if (builder.Environment.IsDevelopment())
        {
            string? sqlConn = builder.Configuration.GetConnectionString("DockerConnection");
                 
            if(!string.IsNullOrWhiteSpace(sqlConn))
            {
                builder.Services.AddHealthChecks()
                    .AddSqlServer(sqlConn, name: HealthCheckNames.SqlServer);
            }

            string? redisHost = builder.Configuration["Redis:Host"];
            string? redisPort = builder.Configuration["Redis:Port"];

            if (!string.IsNullOrWhiteSpace(redisHost) && !string.IsNullOrWhiteSpace(redisPort))
            {
                string redisConn = $"{redisHost}:{redisPort},abortConnect=false";

                builder.Services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConn;
                    options.InstanceName = "MyAppCache:";
                });

                builder.Services.AddSingleton<IConnectionMultiplexer>(_ => 
                    ConnectionMultiplexer.Connect(redisConn));

                builder.Services.AddHealthChecks()
                    .AddRedis(redisConn, name: HealthCheckNames.Redis);
            }
        }
        else
        {
            builder.Services.AddDistributedMemoryCache();
        }
    }
}
