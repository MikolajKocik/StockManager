using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetAssetByIdQueryHandler(
        IMaintenanceAssetRepository assetRepository,
        IMapper mapper,
        ILogger<GetAssetByIdQueryHandler> logger
    ) : IQueryHandler<GetAssetByIdQuery, MaintenanceAssetDto>
{
    private readonly IMaintenanceAssetRepository _assetRepository = assetRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetAssetByIdQueryHandler> _logger = logger;

    public async Task<Result<MaintenanceAssetDto>> Handle(GetAssetByIdQuery query, CancellationToken ct)
    {
        MaintenanceAsset? asset = await _assetRepository.GetAssetWithDetailsByIdAsync(query.Id, ct);

        if (asset is null)
        {
            GeneralLogError.ArgumentException(
                _logger,
                $"Maintenance asset with ID {query.Id} was not found.",
                default
            );

            return Result<MaintenanceAssetDto>.Failure(
                new Error(
                    $"Maintenance asset with ID {query.Id} was not found.",
                    ErrorCodes.MaintenanceAssetNotFound
                )
            );
        }

        GeneralLogInfo.Information(
                _logger,
                $"Successfully retrieved maintenance asset with ID {query.Id}.",
                default
            );
        
        MaintenanceAssetDto dto = _mapper.Map<MaintenanceAssetDto>(asset);
        return Result<MaintenanceAssetDto>.Success(dto);  
    }
}
