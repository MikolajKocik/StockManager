using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetAssetsQueryHandler : IQueryHandler<GetAssetsQuery, List<MaintenanceAssetDto>>
{
    private readonly IMaintenanceAssetRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetAssetsQueryHandler> _logger;

    public GetAssetsQueryHandler(
        IMaintenanceAssetRepository repository,
        IMapper mapper,
        ILogger<GetAssetsQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<List<MaintenanceAssetDto>>> Handle(GetAssetsQuery query, CancellationToken cancellationToken)
    {
        try
        {
            IQueryable<MaintenanceAsset> assetsQuery = _repository.GetAssets()
                .Include(a => a.BinLocation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Type))
            {
                if (Enum.TryParse<AssetType>(query.Type, true, out AssetType typeEnum))
                {
                    assetsQuery = assetsQuery.Where(a => a.Type == typeEnum);
                }
                else
                {
                    return Result<List<MaintenanceAssetDto>>.Failure(
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
                    return Result<List<MaintenanceAssetDto>>.Failure(
                        new Error("Invalid status filter value.", ErrorCodes.GeneralBadRequest));
                }
            }

            List<MaintenanceAsset> assets = await assetsQuery
                .OrderBy(a => a.Name)
                .ToListAsync(cancellationToken);

            List<MaintenanceAssetDto> dtos = _mapper.Map<List<MaintenanceAssetDto>>(assets);
            return Result<List<MaintenanceAssetDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching maintenance assets: {Message}", ex.Message);
            throw;
        }
    }
}
