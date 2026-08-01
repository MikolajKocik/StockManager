using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetAssetsQueryHandler(
        IMaintenanceAssetRepository repository,
        IMapper mapper,
        ILogger<GetAssetsQueryHandler> logger
    ) : IQueryHandler<GetAssetsQuery, IReadOnlyList<MaintenanceAssetDto>>
{
    private readonly IMaintenanceAssetRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetAssetsQueryHandler> _logger = logger;

    public async Task<Result<IReadOnlyList<MaintenanceAssetDto>>> Handle(GetAssetsQuery query, CancellationToken ct)
    {
        IQueryable<MaintenanceAsset> assetsQuery = _repository.GetAssets();

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            if (Enum.TryParse<AssetType>(query.Type, true, out AssetType typeEnum))
            {
                assetsQuery = assetsQuery.Where(a => a.Type == typeEnum);
            }
            else
            {
                GeneralLogError.InvalidOperationException(
                    _logger,
                    $"Invalid type filter value: {query.Type}.",
                    default
                );

                return Result<IReadOnlyList<MaintenanceAssetDto>>.Failure(
                    new Error("Invalid type filter value.", ErrorCodes.GeneralBadRequest));
            }
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            if (Enum.TryParse<AssetStatus>(query.Status, true, out AssetStatus statusEnum))
            {
                    assetsQuery = assetsQuery.Where(a => a.Status == statusEnum);
            }
            else
            {
                GeneralLogError.InvalidOperationException(
                    _logger,
                    $"Invalid status filter value: {query.Status}.",
                    default
                );

                return Result<IReadOnlyList<MaintenanceAssetDto>>.Failure(
                    new Error("Invalid status filter value.", ErrorCodes.GeneralBadRequest));
            }
        }

        List<MaintenanceAsset> assets = await assetsQuery
            .OrderByDescending(a => a.Name)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        GeneralLogInfo.Information(
            _logger,
            $"Retrieve successful with number of assets: {assets.Count}",
            default
        );
            
        List<MaintenanceAssetDto> dtos = _mapper.Map<List<MaintenanceAssetDto>>(assets);
        return Result<IReadOnlyList<MaintenanceAssetDto>>.Success(dtos);
    }
}
