using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.CancelShipment;

public sealed class CancelShipmentCommandHandler(
        IShipmentRepository repository,
        ILogger<CancelShipmentCommandHandler> logger,
        IShipmentService service,
        IUnitOfWork uow
    ) : ICommandHandler<CancelShipmentCommand, Unit>
{
    private readonly IShipmentRepository _repository = repository;
    private readonly IShipmentService _service = service;
    private readonly ILogger<CancelShipmentCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(CancelShipmentCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Shipment? shipment = await _repository.GetShipmentByIdAsync(command.Id, ct);
        if (shipment is null)
        {
            ShipmentLogWarning.LogShipmentNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Shipment with id {command.Id} not found", 
                    ErrorCodes.ShipmentNotFound));
        }

        if (shipment.Status.Equals(ShipmentStatus.Cancelled))
        {
            ShipmentLogWarning.LogShipmentAlreadyCancelled(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Shipment with id {command.Id} is already cancelled", 
                    ErrorCodes.ShipmentAlreadyCancelled));
        }

        if (shipment.Status.Equals(ShipmentStatus.Delivered))
        {
            ShipmentLogWarning.LogShipmentAlreadyDelivered(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Shipment with id {command.Id} is already delivered", 
                    ErrorCodes.ShipmentAlreadyDelivered));
        }

        if (shipment.Status.Equals(ShipmentStatus.Pending))
        {
            ShipmentLogWarning.LogShipmentAlreadyProcessing(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Shipment with id {command.Id} is already processing",
                    ErrorCodes.ShipmentAlreadyProcessing));
        }

        _service.Cancel(shipment);

        await _uow.SaveChangesAsync(ct);

        ShipmentLogInfo.LogShipmentCancelled(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
