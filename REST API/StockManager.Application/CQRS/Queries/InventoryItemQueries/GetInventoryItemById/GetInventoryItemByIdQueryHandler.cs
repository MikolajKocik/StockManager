using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.InventoryItem.InventoryItemCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configurations;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItemById;

public sealed class GetInventoryItemByIdQueryHandler(
    IInventoryItemRepository inventoryItemRepository,
    IMapper mapper,
    IDistributedCache cache,
    IOptionsSnapshot<CacheSettings> cacheSettings,
    IMemoryCache memoryCache,
    ILogger<GetInventoryItemByIdQueryHandler> logger)
    : IQueryHandler<GetInventoryItemByIdQuery, InventoryItemDto>
{
    private readonly IInventoryItemRepository _inventoryItemRepository = inventoryItemRepository;
    private readonly IMapper _mapper = mapper;
    private readonly IDistributedCache _cache = cache;
    private readonly IOptionsSnapshot<CacheSettings> _cacheSettings = cacheSettings;
    private readonly ILogger<GetInventoryItemByIdQueryHandler> _logger = logger;
    private readonly IMemoryCache _memoryCache = memoryCache;

    public async Task<Result<InventoryItemDto>> Handle(GetInventoryItemByIdQuery query, CancellationToken ct)
    {
        string cacheKey = $"inventory-item:{query.Id}:details";

        if (_memoryCache.TryGetValue(cacheKey, out InventoryItemDto? cachedDto))
        {
            InventoryItemCacheLog.ReturnCacheFromInventoryItem(_logger, $"[MEMORY]: {cacheKey}", default);

            if (cachedDto is not null)
            {
                return Result<InventoryItemDto>.Success(cachedDto);
            }
        }

        (bool found, InventoryItemDto? dtoFromCache) = await _cache.ReadFromCacheAsync<InventoryItemDto>(cacheKey, ct);

        if (found && dtoFromCache is not null)
        {
            InventoryItemCacheLog.ReturnCacheFromInventoryItem(_logger, $"[REDIS]: {cacheKey}", default);

            _memoryCache.SetMemoryCache(
                cacheKey,
                dtoFromCache,
                TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
            );

            return Result<InventoryItemDto>.Success(dtoFromCache);
        }

        InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(query.Id, ct);

        if (inventoryItem is null)
        {
            return Result<InventoryItemDto>.Failure(
                new Error(
                    $"Inventory item with id: {query.Id} not found",
                    ErrorCodes.InventoryItemNotFound));
        }

        InventoryItemDto inventoryItemDto = _mapper.Map<InventoryItemDto>(inventoryItem);

        await _cache.SetCacheAsync(
            cacheKey,
            inventoryItemDto,
            _cacheSettings.Value.Redis.AbsoluteTtlHours,
            _cacheSettings.Value.Redis.SlidingTtlMinutes,
            ct);

        InventoryItemCacheLog.StoredKeys(
            _logger,
            $"[REDIS]: {cacheKey}",
            _cacheSettings.Value.Redis.AbsoluteTtlHours,
            _cacheSettings.Value.Redis.SlidingTtlMinutes,
            default
        );

        _memoryCache.SetMemoryCache(
            cacheKey,
            inventoryItemDto,
            TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
        );

        InventoryItemCacheLog.StoredKeys(
            _logger,
            $"[MEMORY]: {cacheKey}",
            default,
            _cacheSettings.Value.Memory.DefaultTtlMinutes,
            default
        );

        return Result<InventoryItemDto>.Success(inventoryItemDto);
    }
}
