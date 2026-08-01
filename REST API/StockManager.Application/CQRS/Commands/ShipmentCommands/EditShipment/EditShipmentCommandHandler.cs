using AutoMapper;
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

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.EditShipment;

public sealed class EditShipmentCommandHandler(
        IShipmentRepository repository,
        IMapper mapper,
        ILogger<EditShipmentCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<EditShipmentCommand, Unit>
{
    private readonly IShipmentRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditShipmentCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditShipmentCommand command, CancellationToken ct)
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

        _mapper.Map(command.UpdateDto, shipment);
        await _uow.SaveChangesAsync(ct);

        ShipmentLogInfo.LogShipmentUpdated(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
