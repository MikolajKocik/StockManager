using System.Text.Json;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.Product.ProductCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;

public class GetProductByIdQueryHandler : IQueryHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;
    private readonly IDistributedCache _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly ILogger<GetProductByIdQueryHandler> _logger;

    public GetProductByIdQueryHandler(
        IMapper mapper,
        IProductRepository repository,
        IDistributedCache cache,
        IOptions<CacheSettings> cacheOptions,
        ILogger<GetProductByIdQueryHandler> logger)
    {
        _mapper = mapper;
        _repository = repository;
        _cache = cache;
        _cacheSettings = cacheOptions.Value;
        _logger = logger;
    }

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
    {
        string cacheKey = $"product:{query.Id}:details";

        (bool found, ProductDto? dtoFromCache) = await _cache.TryGetFromCacheAsync<ProductDto>(cacheKey, cancellationToken);

        if (found)
        {
            ProductCacheLog.ReturnCacheFromProduct(_logger, cacheKey, default);

            return Result<ProductDto>.Success(dtoFromCache!);
        }

        Product? product = await _repository.GetProductByIdAsync(query.Id, cancellationToken);

        if (product is null)
        {
            var error = new Error(
                $"Product with id: {query.Id} not found",
                ErrorCodes.ProductNotFound
            );

            return Result<ProductDto>.Failure(error);
        }

        ProductDto dto = _mapper.Map<ProductDto>(product);

        await _cache.SetCacheObjectAsync(
            cacheKey,
            dto,
            _cacheSettings.ProductAbsoluteTtlHours,
            _cacheSettings.ProductSlidingTtlMinutes,
            cancellationToken);
          
        ProductCacheLog.StoredKeys(      
            _logger, 
            cacheKey, 
            _cacheSettings.ProductAbsoluteTtlHours, 
            _cacheSettings.ProductSlidingTtlMinutes, 
            default);

        return Result<ProductDto>.Success(dto);
    }
}
