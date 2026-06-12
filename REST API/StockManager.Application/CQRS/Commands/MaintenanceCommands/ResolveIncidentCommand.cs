using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;

namespace StockManager.Application.CQRS.Commands.MaintenanceCommands;

public sealed record ResolveIncidentCommand(int IncidentId, ResolveIncidentDto ResolveDto) : ICommand<MaintenanceIncidentDto>;
