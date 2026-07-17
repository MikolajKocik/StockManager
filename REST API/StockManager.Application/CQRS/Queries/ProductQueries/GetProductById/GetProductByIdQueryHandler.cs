using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.Product.ProductCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configurations;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;

public sealed class GetProductByIdQueryHandler(
        IMapper mapper,
        IProductRepository repository,
        IDistributedCache cache,
        IOptionsSnapshot<CacheSettings> cacheOptions,
        ILogger<GetProductByIdQueryHandler> logger,
        IMemoryCache memoryCache
    ) : IQueryHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IProductRepository _repository = repository;
    private readonly IDistributedCache _cache = cache;
    private readonly IOptionsSnapshot<CacheSettings> _cacheSettings = cacheOptions;
    private readonly ILogger<GetProductByIdQueryHandler> _logger = logger;
    private readonly IMemoryCache _memoryCache = memoryCache;

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery query, CancellationToken ct)
    {
        string cacheKey = $"product:{query.Id}:details";

        if (_memoryCache.TryGetValue(cacheKey, out ProductDto? cachedDto))
        {
            ProductCacheLog.ReturnCacheFromProduct(_logger, $"[MEMORY]: {cacheKey}", default);

            if (cachedDto is not null)
            {
                return Result<ProductDto>.Success(cachedDto);
            }
        }

        (bool found, ProductDto? dtoFromCache) = await _cache.ReadFromCacheAsync<ProductDto>(cacheKey, ct);

        if (found && dtoFromCache is not null)
        {
            ProductCacheLog.ReturnCacheFromProduct(_logger, $"[REDIS]: {cacheKey}", default);

            _memoryCache.SetMemoryCache(
                cacheKey,
                dtoFromCache,
                TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
            );

            return Result<ProductDto>.Success(dtoFromCache);
        }

        Product? product = await _repository.GetProductByIdAsync(query.Id, ct);

        if (product is null)
        {
            return Result<ProductDto>.Failure(
                new Error(
                    $"Product with id: {query.Id} not found",
                    ErrorCodes.ProductNotFound
                )
            );
        }

        ProductDto dto = _mapper.Map<ProductDto>(product);

        await _cache.SetCacheAsync(
            cacheKey,
            dto,
            _cacheSettings.Value.Product.AbsoluteTtlHours,
            _cacheSettings.Value.Product.SlidingTtlMinutes,
            ct);
          
        ProductCacheLog.StoredKeys(      
            _logger, 
            $"[REDIS]: {cacheKey}", 
            _cacheSettings.Value.Product.AbsoluteTtlHours, 
            _cacheSettings.Value.Product.SlidingTtlMinutes,
            default);

        _memoryCache.SetMemoryCache(
            cacheKey,
            dto,
            TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
        );

        ProductCacheLog.StoredKeys(
            _logger,
            $"[MEMORY]: {cacheKey}",
            default,
            _cacheSettings.Value.Memory.DefaultTtlMinutes,
            default
        );

        return Result<ProductDto>.Success(dto);
    }
}
