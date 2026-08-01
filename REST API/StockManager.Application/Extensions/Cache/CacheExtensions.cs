using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace StockManager.Application.Extensions.Cache;

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
    public static async Task<(bool Found,T? Value)> ReadFromCacheAsync<T>(  
        this IDistributedCache cache,
        string cacheKey,
        CancellationToken ct = default) 
    {
        string? cachedJson = await cache.GetStringAsync(cacheKey, ct).ConfigureAwait(false);

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
            await cache.RemoveAsync(cacheKey, ct).ConfigureAwait(false);
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
    public static async Task SetCacheAsync<T>(
        this IDistributedCache cache,   
        string cacheKey,
        T value,
        int absoluteTtlHours,
        int slidingTtlMinutes,
        CancellationToken ct = default
        )
    {
        string json = JsonSerializer.Serialize(value);

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(absoluteTtlHours),
            SlidingExpiration = TimeSpan.FromMinutes(slidingTtlMinutes)
        };
        await cache.SetStringAsync(cacheKey, json, options, ct).ConfigureAwait(false);
    }
}
