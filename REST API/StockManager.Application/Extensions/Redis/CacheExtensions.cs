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
using StockManager.Application.Configurations;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Extensions.Redis;

internal static class CacheExtensions
{
    /// <summary>
    /// Attempts to retrieve a value of type <typeparamref name="T"/> from the distributed cache.
    /// </summary>
    /// <remarks>If the cached value is not found, is empty, or cannot be deserialized into the specified type
    /// <typeparamref name="T"/>, the method returns <c>(false, null)</c>. If deserialization fails due to invalid JSON,
    /// the corresponding cache entry is removed.</remarks>
    /// <typeparam name="T">The type of the value to retrieve. Must be a reference type.</typeparam>
    /// <param name="cache">The <see cref="IDistributedCache"/> instance to retrieve the value from.</param>
    /// <param name="cacheKey">The key identifying the cached value.</param>
    /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the operation to complete.</param>
    /// <returns>A tuple containing a boolean and a value: <list type="bullet"> <item><description><c>Found</c>: <see
    /// langword="true"/> if the value was successfully retrieved and deserialized; otherwise, <see
    /// langword="false"/>.</description></item> <item><description><c>Value</c>: The deserialized value of type
    /// <typeparamref name="T"/> if found; otherwise, <see langword="null"/>.</description></item> </list></returns>
    public static async Task<(bool Found,T? Value)> TryGetFromCacheAsync<T>(  
        this IDistributedCache cache,
        string cacheKey,
        CancellationToken cancellationToken = default
        ) where T : class
    {
        string? cachedJson = await cache.GetStringAsync(cacheKey, cancellationToken).ConfigureAwait(false);

        if (string.IsNullOrWhiteSpace(cachedJson))
        {
            return (false, default);
        }

        try
        {
            T? value = JsonSerializer.Deserialize<T>(cachedJson);
             
            if(value == null)
            {
                return (false, default);
            }

            return (true, value);
        }
        catch(JsonException)
        {
            await cache.RemoveAsync(cacheKey, cancellationToken).ConfigureAwait(false);
            return (false, default);
        }
    }

    /// <summary>
    /// Asynchronously sets an object in the distributed cache with the specified key, value, and expiration settings.
    /// </summary>
    /// <remarks>The object is serialized to JSON before being stored in the cache. The cache entry will
    /// expire either after the specified absolute expiration time or if the sliding expiration time elapses without the
    /// entry being accessed, whichever comes first.</remarks>
    /// <typeparam name="T">The type of the object to cache. The object will be serialized to JSON.</typeparam>
    /// <param name="cache">The <see cref="IDistributedCache"/> instance used to store the object.</param>
    /// <param name="cacheKey">The key under which the object will be stored in the cache. Cannot be null or empty.</param>
    /// <param name="value">The object to store in the cache. Cannot be null.</param>
    /// <param name="absoluteTtlHours">The absolute expiration time, in hours, after which the cache entry will expire. Must be greater than zero.</param>
    /// <param name="slidingTtlMinutes">The sliding expiration time, in minutes, which resets the expiration timer each time the cache entry is
    /// accessed. Must be greater than zero.</param>
    /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the operation to complete. Optional.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
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

    /// <summary>
    /// Increments the value of a specified key in Redis and sets its expiration if the key is newly created.
    /// </summary>
    /// <remarks>If the key does not exist in Redis, it will be created with an initial value of 1, and the
    /// specified expiration will be applied. If the key already exists, its value will be incremented, and the
    /// expiration will not be modified.</remarks>
    /// <param name="redis">The <see cref="IConnectionMultiplexer"/> instance used to interact with the Redis database.</param>
    /// <param name="key">The key whose value will be incremented. Cannot be <see langword="null"/> or empty.</param>
    /// <param name="absoluteExpiration">The duration after which the key will expire if it is newly created. This is only applied when the key is
    /// incremented for the first time.</param>
    /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the operation to complete. The default value is
    /// <see cref="CancellationToken.None"/>.</param>
    /// <returns>A <see cref="Task{TResult}"/> representing the asynchronous operation. The task result contains the new value of
    /// the key after the increment.</returns>
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

    /// <summary>
    /// Asynchronously removes the specified key from the Redis database.
    /// </summary>
    /// <param name="redis">The connection multiplexer used to interact with the Redis server.</param>
    /// <param name="key">The key to be removed. Cannot be <see langword="null"/> or empty.</param>
    /// <param name="flags">The command flags to use when executing the operation. The default is <see cref="CommandFlags.None"/>.</param>
    /// <returns>A task that represents the asynchronous operation. The task result is <see langword="true"/> if the key was
    /// successfully removed; otherwise, <see langword="false"/>.</returns>
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
