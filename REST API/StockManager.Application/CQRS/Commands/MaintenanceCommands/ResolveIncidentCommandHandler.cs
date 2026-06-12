using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed class ResolveIncidentCommandHandler : ICommandHandler<ResolveIncidentCommand, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository;
    private readonly IMaintenanceAssetRepository _assetRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<ResolveIncidentCommandHandler> _logger;

    public ResolveIncidentCommandHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMaintenanceAssetRepository assetRepository,
        IMapper mapper,
        ILogger<ResolveIncidentCommandHandler> logger)
    {
        _incidentRepository = incidentRepository;
        _assetRepository = assetRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<MaintenanceIncidentDto>> Handle(ResolveIncidentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            MaintenanceIncident? incident = await _incidentRepository.GetIncidentByIdAsync(command.IncidentId, cancellationToken);
            if (incident == null)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error("The specified maintenance incident was not found.", ErrorCodes.MaintenanceIncidentNotFound));
            }

            if (incident.Status == IncidentStatus.Resolved || incident.Status == IncidentStatus.Cancelled)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error($"Cannot resolve incident. It is already in {incident.Status} status.", ErrorCodes.MaintenanceIncidentConflict));
            }

            if (string.IsNullOrWhiteSpace(incident.AssignedToId))
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error("Cannot resolve an incident that is not currently assigned to a technician.", ErrorCodes.MaintenanceIncidentConflict));
            }

            incident.Resolve(command.ResolveDto.ResolutionNotes);

            if (incident.AssetId.HasValue)
            {
                MaintenanceAsset? asset = await _assetRepository.GetAssetByIdAsync(incident.AssetId.Value, cancellationToken);
                if (asset != null)
                {
                    bool hasOtherActiveIncidents = await _incidentRepository.HasOtherActiveIncidentsForAssetAsync(asset.Id, incident.Id, cancellationToken);

                    if (!hasOtherActiveIncidents)
                    {
                        asset.RecordService(DateTime.UtcNow);
                        await _assetRepository.UpdateAssetAsync(asset, cancellationToken);
                    }
                    else
                    {
                        _logger.LogInformation("Asset {AssetId} has other active maintenance incidents. Keeping asset status as is.", asset.Id);
                    }
                }
            }

            await _incidentRepository.UpdateIncidentAsync(incident, cancellationToken);

            MaintenanceIncident? fullIncident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(incident.Id, cancellationToken);

            MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(fullIncident ?? incident);
            return Result<MaintenanceIncidentDto>.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to resolve maintenance incident {IncidentId}: {Message}", command.IncidentId, ex.Message);
            throw;
        }
    }
}
