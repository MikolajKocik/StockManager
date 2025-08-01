using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.EditShipment;

public sealed class EditShipmentCommandHandler : ICommandHandler<EditShipmentCommand, Unit>
{
    private readonly IShipmentRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EditShipmentCommandHandler> _logger;

    public EditShipmentCommandHandler(
        IShipmentRepository repository,
        IMapper mapper,
        ILogger<EditShipmentCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(EditShipmentCommand command, CancellationToken cancellationToken)
    {
        try
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

            _mapper.Map(command.UpdateDto, shipment);

            await _repository.UpdateShipmentAsync(shipment, cancellationToken);

            ShipmentLogInfo.LogShipmentUpdated(_logger, command.Id, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            ShipmentLogWarning.LogShipmentAlreadyExists(_logger, default, command.UpdateDto, default);
            return Result<Unit>.Failure(
                new Error(
                    "Shipment violates unique constraints (duplicate).",
                    ErrorCodes.ShipmentConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
