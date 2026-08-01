using Microsoft.Extensions.Caching.Memory;

namespace StockManager.Application.Extensions.Cache;

public static class MemoryCacheExtensions
{
    public static void SetMemoryCache<T>(
        this IMemoryCache memoryCache,
        string key,
        T value, 
        TimeSpan expiration)
    {
        memoryCache.Set(
            key,
            value,
            expiration
        );
    }
}