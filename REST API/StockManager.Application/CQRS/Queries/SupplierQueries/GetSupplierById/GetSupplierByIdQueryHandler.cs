using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.Supplier.SupplierCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configurations;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;

public sealed class GetSupplierByIdQueryHandler(
    ISupplierRepository supplierRepository,
    IMapper mapper,
    IDistributedCache cache,
    IOptionsSnapshot<CacheSettings> cacheOptions,
    IMemoryCache memoryCache,
    ILogger<GetSupplierByIdQueryHandler> logger) : IQueryHandler<GetSupplierByIdQuery, SupplierDto>
{
    private readonly ISupplierRepository _supplierRepository = supplierRepository;
    private readonly IMapper _mapper = mapper;
    private readonly IDistributedCache _cache = cache;
    private readonly IOptionsSnapshot<CacheSettings> _cacheSettings = cacheOptions;
    private readonly ILogger<GetSupplierByIdQueryHandler> _logger = logger;
    private readonly IMemoryCache _memoryCache = memoryCache;

    public async Task<Result<SupplierDto>> Handle(GetSupplierByIdQuery query, CancellationToken ct)
    {
        string cacheKey = $"supplier:{query.Id}:details";

        if (_memoryCache.TryGetValue(cacheKey, out SupplierDto? cachedDto))
        {
            SupplierCacheLog.ReturnCacheFromSupplier(_logger, $"[MEMORY]: {cacheKey}", default);

            if (cachedDto is not null)
            {
                return Result<SupplierDto>.Success(cachedDto);
            }
        }
        
        (bool found, SupplierDto? dtoFromCache)  = await _cache.ReadFromCacheAsync<SupplierDto>(cacheKey, ct);

        if (found && dtoFromCache is not null)
        {
            SupplierCacheLog.ReturnCacheFromSupplier(_logger, cacheKey, default);

            _memoryCache.SetMemoryCache(
                cacheKey,
                dtoFromCache,
                TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
            );
            
            return Result<SupplierDto>.Success(dtoFromCache);
        }

        Supplier? getSupplier = await _supplierRepository.GetSupplierByIdAsync(query.Id, ct);

        if(getSupplier is null)
        {
            var error = new Error(
                $"Supplier with provided id: {query.Id} not found",
                ErrorCodes.SupplierNotFound
            );

            return Result<SupplierDto>.Failure(error);
        }

        SupplierDto dto = _mapper.Map<SupplierDto>(getSupplier);

        await _cache.SetCacheAsync(
            cacheKey,
            dto,
            _cacheSettings.Value.Supplier.AbsoluteTtlHours,
            _cacheSettings.Value.Supplier.SlidingTtlMinutes,
            ct);

        SupplierCacheLog.StoredKeys(
            _logger,
            $"[REDIS]: {cacheKey}",
            _cacheSettings.Value.Redis.AbsoluteTtlHours,
            _cacheSettings.Value.Redis.SlidingTtlMinutes,
            default
        );
            
        _memoryCache.SetMemoryCache(
            cacheKey,
            dto,
            TimeSpan.FromMinutes(_cacheSettings.Value.Memory.DefaultTtlMinutes)
        );

        SupplierCacheLog.StoredKeys(
            _logger,
            $"[MEMORY]: {cacheKey}",
            default,
            _cacheSettings.Value.Memory.DefaultTtlMinutes,
            default
        );

        return Result<SupplierDto>.Success(dto);
    }
}
