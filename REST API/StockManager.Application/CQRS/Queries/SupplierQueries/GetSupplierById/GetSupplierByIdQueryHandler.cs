using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.Supplier.SupplierCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configurations;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;

public sealed class GetSupplierByIdQueryHandler : IQueryHandler<GetSupplierByIdQuery, SupplierDto>
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly ILogger<GetSupplierByIdQueryHandler> _logger;

    public GetSupplierByIdQueryHandler(
        ISupplierRepository supplierRepository,
        IMapper mapper,
        IDistributedCache cache,
        IOptions<CacheSettings> cacheOptions,
        ILogger<GetSupplierByIdQueryHandler> logger)
    {
        _supplierRepository = supplierRepository;
        _mapper = mapper;
        _cache = cache;
        _cacheSettings = cacheOptions.Value;
        _logger = logger;
    }
    public async Task<Result<SupplierDto>> Handle(GetSupplierByIdQuery query, CancellationToken cancellationToken)
    {
        string cacheKey = $"supplier:{query.Id}:details";

        (bool found, SupplierDto? dtoFromCache)  = await _cache.TryGetFromCacheAsync<SupplierDto>(cacheKey, cancellationToken);

        if (found)
        {
            SupplierCacheLog.ReturnCacheFromSupplier(_logger, cacheKey, default);

            return Result<SupplierDto>.Success(dtoFromCache!);
        }

        Supplier? getSupplier = await _supplierRepository.GetSupplierByIdAsync(query.Id, cancellationToken);

        if(getSupplier is null)
        {
            var error = new Error(
                $"Supplier with provided id: {query.Id} not found",
                ErrorCodes.SupplierNotFound
            );

            return Result<SupplierDto>.Failure(error);
        }

        SupplierDto dto = _mapper.Map<SupplierDto>(getSupplier);

        await _cache.SetCacheObjectAsync(
            cacheKey,
            dto,
            _cacheSettings.SupplierAbsoluteTtlHours,
            _cacheSettings.SupplierSlidingTtlMinutes,
            cancellationToken);

        SupplierCacheLog.StoredKeys(
            _logger,
            cacheKey,
            _cacheSettings.SupplierAbsoluteTtlHours,
            _cacheSettings.SupplierSlidingTtlMinutes,
            default);

        return Result<SupplierDto>.Success(dto);
    }
}
