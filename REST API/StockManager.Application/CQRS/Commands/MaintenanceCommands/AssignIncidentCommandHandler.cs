using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed class AssignIncidentCommandHandler : ICommandHandler<AssignIncidentCommand, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository;
    private readonly IMaintenanceAssetRepository _assetRepository;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly ILogger<AssignIncidentCommandHandler> _logger;

    public AssignIncidentCommandHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMaintenanceAssetRepository assetRepository,
        UserManager<User> userManager,
        IMapper mapper,
        ILogger<AssignIncidentCommandHandler> logger)
    {
        _incidentRepository = incidentRepository;
        _assetRepository = assetRepository;
        _userManager = userManager;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<MaintenanceIncidentDto>> Handle(AssignIncidentCommand command, CancellationToken cancellationToken)
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
                    new Error($"Cannot assign technician. The incident is currently in {incident.Status} status.", ErrorCodes.MaintenanceIncidentConflict));
            }

            User? technician = await _userManager.FindByIdAsync(command.AssignedToId);
            if (technician == null)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error("The specified technician user was not found.", ErrorCodes.UserValidation));
            }

            incident.AssignTechnician(command.AssignedToId);

            if (incident.AssetId.HasValue)
            {
                MaintenanceAsset? asset = await _assetRepository.GetAssetByIdAsync(incident.AssetId.Value, cancellationToken);
                if (asset != null && asset.Status == AssetStatus.Operational)
                {
                    asset.UpdateStatus(AssetStatus.UnderMaintenance);
                    await _assetRepository.UpdateAssetAsync(asset, cancellationToken);
                }
            }

            await _incidentRepository.UpdateIncidentAsync(incident, cancellationToken);

            MaintenanceIncident? fullIncident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(incident.Id, cancellationToken);

            MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(fullIncident ?? incident);
            return Result<MaintenanceIncidentDto>.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to assign technician to maintenance incident {IncidentId}: {Message}", command.IncidentId, ex.Message);
            throw;
        }
    }
}
