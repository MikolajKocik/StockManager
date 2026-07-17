using StackExchange.Redis;
namespace StockManager.Application.Extensions.Cache;

internal static class RedisExtensions
{
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
        CancellationToken ct = default
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