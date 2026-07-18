using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed class ResolveIncidentCommandHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMaintenanceAssetRepository assetRepository,
        IMapper mapper,
        ILogger<ResolveIncidentCommandHandler> logger,
        IMessageBus messageBus,
        IUnitOfWork uow
    ) : ICommandHandler<ResolveIncidentCommand, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository = incidentRepository;
    private readonly IMaintenanceAssetRepository _assetRepository = assetRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<ResolveIncidentCommandHandler> _logger = logger;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<MaintenanceIncidentDto>> Handle(ResolveIncidentCommand command, CancellationToken ct)
    {
        MaintenanceIncident? incident = await _incidentRepository.GetIncidentByIdAsync(command.IncidentId, ct);
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
            MaintenanceAsset? asset = await _assetRepository.GetAssetByIdAsync(incident.AssetId.Value, ct);
            if (asset != null)
            {
                bool hasOtherActiveIncidents = await _incidentRepository.HasOtherActiveIncidentsForAssetAsync(asset.Id, incident.Id, ct);

                if (!hasOtherActiveIncidents)
                {
                    asset.RecordService(DateTime.UtcNow);
                }
                else
                {
                    _logger.LogInformation("Asset {AssetId} has other active maintenance incidents. Keeping asset status as is.", asset.Id);
                }
            }
        }

        await _uow.SaveChangesAsync(ct);

        MaintenanceIncident? fullIncident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(incident.Id, ct);

        MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(fullIncident ?? incident);

        await _messageBus.PublishAsync(
            new ActivityMessage(
                Title: "Incident resolved",
                Description: $"Incident ID {incident.Id} ('{incident.Title}') has been resolved.",
                Category: "Maintenance",
                Type: "Success",
                Timestamp: DateTime.UtcNow,
                User: "Technician"
            ),
            "activities-queue",
            ct
        );

        return Result<MaintenanceIncidentDto>.Success(dto);
    }
}
