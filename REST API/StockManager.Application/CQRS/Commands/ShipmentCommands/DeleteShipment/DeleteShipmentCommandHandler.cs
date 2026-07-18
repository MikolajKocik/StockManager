using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.DeleteShipment;

public sealed class DeleteShipmentCommandHandler(
        IShipmentRepository repository,
        ILogger<DeleteShipmentCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteShipmentCommand, Unit>
{
    private readonly IShipmentRepository _repository = repository;
    private readonly ILogger<DeleteShipmentCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteShipmentCommand command, CancellationToken ct)
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

        await _repository.DeleteShipmentAsync(shipment.Id, ct);
        await _uow.SaveChangesAsync(ct);

        ShipmentLogInfo.LogShipmentDeleted(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
