using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.InventoryItem.InventoryItemCache;
using StockManager.Application.Common.Logging.Product.ProductCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItemById;
public sealed class GetInventoryItemByIdQueryHandler : IQueryHandler<GetInventoryItemByIdQuery, InventoryItemDto>
{
    private readonly IInventoryItemRepository _inventoryItemRepository;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly ILogger<GetInventoryItemByIdQueryHandler> _logger;

    public GetInventoryItemByIdQueryHandler(
        IInventoryItemRepository inventoryItemRepository,
        IMapper mapper,
        IDistributedCache cache,
        CacheSettings cacheSettings,
        ILogger<GetInventoryItemByIdQueryHandler> logger
        )
    {
        _inventoryItemRepository = inventoryItemRepository;
        _mapper = mapper;
        _cache = cache;
        _cacheSettings = cacheSettings;
        _logger = logger;
    }

    public async Task<Result<InventoryItemDto>> Handle(GetInventoryItemByIdQuery query, CancellationToken cancellationToken)
    {
        string cacheKey = $"inventory-item:{query.Id}:details";

        (bool found, InventoryItemDto? dtoFromCache) = await _cache.TryGetFromCacheAsync<InventoryItemDto>(cacheKey, cancellationToken);

        if (found)
        {
            InventoryItemCacheLog.ReturnCacheFromInventoryItem(_logger, cacheKey, default);

            return Result<InventoryItemDto>.Success(dtoFromCache!);
        }

        InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(query.Id, cancellationToken);

        if (inventoryItem is null)
        {
            return Result<InventoryItemDto>.Failure(
                new Error(
                    $"Inventory item with id: {query.Id} not found",
                    ErrorCodes.InventoryItemNotFound));
        }

        InventoryItemDto inventoryItemDto = _mapper.Map<InventoryItemDto>(inventoryItem);

        await _cache.SetCacheObjectAsync(
            cacheKey, 
            inventoryItemDto,
            _cacheSettings.InventoryItemAbsoluteTtlHours,
            _cacheSettings.InventoryItemSlidingTtlMinutes,
            cancellationToken);

        InventoryItemCacheLog.StoredKeys(
          _logger,
          cacheKey,
          _cacheSettings.InventoryItemAbsoluteTtlHours,
          _cacheSettings.InventoryItemSlidingTtlMinutes,
          default);

        return Result<InventoryItemDto>.Success(inventoryItemDto);
    }
}
