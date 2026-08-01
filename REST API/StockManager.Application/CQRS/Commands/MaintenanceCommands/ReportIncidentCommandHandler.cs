using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed class ReportIncidentCommandHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMaintenanceAssetRepository assetRepository,
        IInventoryItemRepository inventoryItemRepository,
        UserManager<User> userManager,
        IMapper mapper,
        ILogger<ReportIncidentCommandHandler> logger,
        IMessageBus messageBus,
        IUnitOfWork uow
    ) : ICommandHandler<ReportIncidentCommand, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository = incidentRepository;
    private readonly IMaintenanceAssetRepository _assetRepository = assetRepository;
    private readonly IInventoryItemRepository _inventoryItemRepository = inventoryItemRepository;
    private readonly UserManager<User> _userManager = userManager;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<ReportIncidentCommandHandler> _logger = logger;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<MaintenanceIncidentDto>> Handle(ReportIncidentCommand command, CancellationToken ct)
    {
        User? user = await _userManager.FindByIdAsync(command.ReportedById);
        if (user == null)
        {
            return Result<MaintenanceIncidentDto>.Failure(
                new Error("User reporting the incident was not found.", ErrorCodes.UserValidation));
        }

        if (!Enum.TryParse<IncidentPriority>(command.CreateDto.Priority, true, out IncidentPriority priority))
        {
            return Result<MaintenanceIncidentDto>.Failure(
                new Error("Invalid incident priority value.", ErrorCodes.GeneralBadRequest));
        }

        MaintenanceAsset? asset = null;
        if (command.CreateDto.AssetId.HasValue)
        {
            asset = await _assetRepository.GetAssetByIdAsync(command.CreateDto.AssetId.Value, ct);
            if (asset == null)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error("The specified asset was not found.", ErrorCodes.MaintenanceAssetNotFound));
            }
        }

        if (command.CreateDto.BinLocationId.HasValue)
        {
            BinLocation? binLocation = await _inventoryItemRepository.GetBinLocationByIdAsync(command.CreateDto.BinLocationId.Value, ct);
            if (binLocation == null)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error("The specified bin location was not found.", ErrorCodes.InventoryBinLocationNotFound));
            }
        }

        var incident = new MaintenanceIncident(
            command.CreateDto.Title,
            command.CreateDto.Description,
            priority,
            command.ReportedById,
            command.CreateDto.PhotoUrl,
            command.CreateDto.AssetId,
            command.CreateDto.BinLocationId
        );

        if (asset != null)
        {
            if (priority == IncidentPriority.Critical)
            {
                asset.UpdateStatus(AssetStatus.OutOfService);
            }
            else if (priority == IncidentPriority.High)
            {
                asset.UpdateStatus(AssetStatus.UnderMaintenance);
            }
        }

        _incidentRepository.AddIncident(incident);
        await _uow.SaveChangesAsync(ct);

        GeneralLogInfo.Information(_logger, $"Incident {incident.Id} reported successfully.", null);

        MaintenanceIncident? fullIncident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(incident.Id, ct);

        MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(fullIncident ?? incident);

        await _messageBus.PublishAsync(
            new ActivityMessage(
                Title: "Incident reported",
                Description: $"Incident reported: '{command.CreateDto.Title}' with priority: {priority}",
                Category: "Maintenance",
                Type: priority == IncidentPriority.Critical
                    ? nameof(IncidentPriority.Critical)
                    : nameof(IncidentPriority.Medium),
                Timestamp: DateTime.UtcNow,
                User: user.UserName
            ),
            "activities-queue",
            ct
        );

        return Result<MaintenanceIncidentDto>.Success(dto);
    }
}
