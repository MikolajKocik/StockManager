using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetAssetByIdQueryHandler : IQueryHandler<GetAssetByIdQuery, MaintenanceAssetDto>
{
    private readonly IMaintenanceAssetRepository _assetRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetAssetByIdQueryHandler> _logger;

    public GetAssetByIdQueryHandler(
        IMaintenanceAssetRepository assetRepository,
        IMapper mapper,
        ILogger<GetAssetByIdQueryHandler> logger)
    {
        _assetRepository = assetRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<MaintenanceAssetDto>> Handle(GetAssetByIdQuery query, CancellationToken cancellationToken)
    {
        try
        {
            MaintenanceAsset? asset = await _assetRepository.GetAssetWithDetailsByIdAsync(query.Id, cancellationToken);

            if (asset == null)
            {
                return Result<MaintenanceAssetDto>.Failure(
                    new Error($"Maintenance asset with ID {query.Id} was not found.", ErrorCodes.MaintenanceAssetNotFound));
            }

            MaintenanceAssetDto dto = _mapper.Map<MaintenanceAssetDto>(asset);
            return Result<MaintenanceAssetDto>.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve maintenance asset {AssetId}: {Message}", query.Id, ex.Message);
            throw;
        }
    }
}
