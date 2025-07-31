using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.DeleteShipment;

public sealed class DeleteShipmentCommandHandler : ICommandHandler<DeleteShipmentCommand, Unit>
{
    private readonly IShipmentRepository _repository;
    private readonly ILogger<DeleteShipmentCommandHandler> _logger;

    public DeleteShipmentCommandHandler(
        IShipmentRepository repository,
        ILogger<DeleteShipmentCommandHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(DeleteShipmentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            Shipment? shipment = await _repository.GetShipmentByIdAsync(command.Id, cancellationToken);
            if (shipment is null)
            {
                ShipmentLogWarning.LogShipmentNotFound(_logger, command.Id, default);
                return Result<Unit>.Failure(
                    new Error(
                        $"Shipment with id {command.Id} not found", 
                        ErrorCodes.ShipmentNotFound));
            }

            await _repository.DeleteShipmentAsync(shipment, cancellationToken);

            ShipmentLogInfo.LogShipmentDeleted(_logger, command.Id, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
