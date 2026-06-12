using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed class ReportIncidentCommandHandler : ICommandHandler<ReportIncidentCommand, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository;
    private readonly IMaintenanceAssetRepository _assetRepository;
    private readonly IInventoryItemRepository _inventoryItemRepository;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly ILogger<ReportIncidentCommandHandler> _logger;

    public ReportIncidentCommandHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMaintenanceAssetRepository assetRepository,
        IInventoryItemRepository inventoryItemRepository,
        UserManager<User> userManager,
        IMapper mapper,
        ILogger<ReportIncidentCommandHandler> logger)
    {
        _incidentRepository = incidentRepository;
        _assetRepository = assetRepository;
        _inventoryItemRepository = inventoryItemRepository;
        _userManager = userManager;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<MaintenanceIncidentDto>> Handle(ReportIncidentCommand command, CancellationToken cancellationToken)
    {
        try
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
                asset = await _assetRepository.GetAssetByIdAsync(command.CreateDto.AssetId.Value, cancellationToken);
                if (asset == null)
                {
                    return Result<MaintenanceIncidentDto>.Failure(
                        new Error("The specified asset was not found.", ErrorCodes.MaintenanceAssetNotFound));
                }
            }

            if (command.CreateDto.BinLocationId.HasValue)
            {
                BinLocation? binLocation = await _inventoryItemRepository.GetBinLocationByIdAsync(command.CreateDto.BinLocationId.Value, cancellationToken);
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
                    await _assetRepository.UpdateAssetAsync(asset, cancellationToken);
                }
                else if (priority == IncidentPriority.High)
                {
                    asset.UpdateStatus(AssetStatus.UnderMaintenance);
                    await _assetRepository.UpdateAssetAsync(asset, cancellationToken);
                }
            }

            MaintenanceIncident created = await _incidentRepository.AddIncidentAsync(incident, cancellationToken);
            MaintenanceIncident? fullIncident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(created.Id, cancellationToken);

            MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(fullIncident ?? created);
            return Result<MaintenanceIncidentDto>.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to report maintenance incident: {Message}", ex.Message);
            throw;
        }
    }
}
