using System.Text.Json;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.Dtos.ModelsDto.Product;
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

    public GetProductByIdQueryHandler(
        IMapper mapper,
        IProductRepository repository,
        IDistributedCache cache,
        IOptions<CacheSettings> cacheOptions)
    {
        _mapper = mapper;
        _repository = repository;
        _cache = cache;
        _cacheSettings = cacheOptions.Value;
    }

    public async Task<Result<ProductDto>> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
    {
        string cacheKey = $"product:{query.Id}";
        string? cached = await _cache.GetStringAsync(cacheKey, cancellationToken);

        if (cached is not null)
        {
            // here will be logger   _logger.LogInformation("Zwracam produkt z cache’a (key={CacheKey})", cacheKey);
            ProductDto? dtoFromCache = JsonSerializer.Deserialize<ProductDto>(cached)!;

            return Result<ProductDto>.Success(dtoFromCache);
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
        string serialized = JsonSerializer.Serialize(dto);

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(_cacheSettings.ProductAbsoluteTtlHours),
            SlidingExpiration = TimeSpan.FromMinutes(_cacheSettings.ProductSlidingTtlMinutes)
        };
        await _cache.SetStringAsync(cacheKey, serialized, options, cancellationToken);
        //   _logger.LogInformation("Stored {Key} in cache for {Abs}h absolute, {Slide}m sliding",
       // cacheKey,
          //  _cacheSettings.ProductAbsoluteTtlHours,
          //  _cacheSettings.ProductSlidingTtlMinutes);

        return Result<ProductDto>.Success(dto);
    }
}
