namespace StockManager.Application.Configurations;

public sealed class CacheSettings
{
    public MemoryCacheSettings Memory { get; set; } = new();

    public RedisCacheSettings Redis { get; set; } = new();

    public EntityCacheSettings Product { get; set; } = new();

    public EntityCacheSettings Supplier { get; set; } = new();

    public EntityCacheSettings InventoryItem { get; set; } = new();
}


public sealed class MemoryCacheSettings
{
    public int DefaultTtlMinutes { get; set; } = 5;
}


public sealed class RedisCacheSettings
{
    public int AbsoluteTtlHours { get; set; } = 6;

    public int SlidingTtlMinutes { get; set; } = 60;
}


public sealed class EntityCacheSettings
{
    public int AbsoluteTtlHours { get; set; } = 6;

    public int SlidingTtlMinutes { get; set; } = 60;
}
