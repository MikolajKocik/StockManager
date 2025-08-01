using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.MarkAsReturned;

public sealed class MarkShipmentAsReturnedCommandHandler : ICommandHandler<MarkShipmentAsReturnedCommand, Unit>
{
    private readonly IShipmentRepository _repository;
    private readonly IShipmentService _shipmentService;
    private readonly ILogger<MarkShipmentAsReturnedCommandHandler> _logger;

    public MarkShipmentAsReturnedCommandHandler(
        IShipmentRepository repository,
        ILogger<MarkShipmentAsReturnedCommandHandler> logger,
        IShipmentService shipmentService
        )
    {
        _repository = repository;
        _logger = logger;
        _shipmentService = shipmentService;
    }

    public async Task<Result<Unit>> Handle(MarkShipmentAsReturnedCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        Shipment? shipment = await _repository.GetShipmentByIdAsync(command.Id, cancellationToken);
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

        if (shipment.Status.Equals(ShipmentStatus.Returned))
        {
            ShipmentLogWarning.LogShipmentAlreadyReturned(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Shipment with id {command.Id} is already returned",
                    ErrorCodes.ShipmentAlreadyReturned));
        }

        _shipmentService.MarkReturned(shipment);

        await _repository.UpdateShipmentAsync(shipment, cancellationToken);

        ShipmentLogInfo.LogShipmentMarkedReturned(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
