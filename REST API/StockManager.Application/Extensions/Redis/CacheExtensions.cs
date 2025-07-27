using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using StockManager.Application.Common.Logging.Supplier.SupplierCache;
using StockManager.Application.Configuration;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Extensions.Redis;

internal static class CacheExtensions
{
    public static async Task<(bool Found,T? Value)> TryGetFromCacheAsync<T>(  
        this IDistributedCache cache,
        string cacheKey,
        CancellationToken cancellationToken = default
        ) where T : class
    {
        string? cachedJson = await cache.GetStringAsync(cacheKey, cancellationToken).ConfigureAwait(false);

        if (cachedJson is null)
        {
            return (false, null);
        }

        T value = JsonSerializer.Deserialize<T>(cachedJson);
        return (true, value);
    }

    public static async Task SetCacheObjectAsync<T>(
        this IDistributedCache cache,   
        string cacheKey,
        T value,
        int absoluteTtlHours,
        int slidingTtlMinutes,
        CancellationToken cancellationToken = default
        )
    {
        string json = JsonSerializer.Serialize(value);

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(absoluteTtlHours),
            SlidingExpiration = TimeSpan.FromMinutes(slidingTtlMinutes)
        };
        await cache.SetStringAsync(cacheKey, json, options, cancellationToken).ConfigureAwait(false);
    }

    public static async Task<long> IncrementKeyAsync(
        this IConnectionMultiplexer redis,
        string key,
        TimeSpan absoluteExpiration,
        CancellationToken cancellationToken = default
        )
    {
        IDatabase db = redis.GetDatabase();
        long count = await db.StringIncrementAsync(key).ConfigureAwait(false);

        if (count == 1)
        {
            await db.KeyExpireAsync(key, absoluteExpiration).ConfigureAwait(false);
        }

        return count;
    }

    public static Task<bool> RemoveKeyAsync(
        this IConnectionMultiplexer redis,
        string key,
        CommandFlags flags = CommandFlags.None
        )
    {
        IDatabase db = redis.GetDatabase();
        return db.KeyDeleteAsync(key, flags);
    }
}
