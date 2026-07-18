using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.AddShipment;

public sealed class AddShipmentCommandHandler(
        IShipmentRepository repository,
        IMapper mapper,
        ILogger<AddShipmentCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<AddShipmentCommand, ShipmentDto>
{
    private readonly IShipmentRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddShipmentCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<ShipmentDto>> Handle(AddShipmentCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

        Shipment shipment = _mapper.Map<Shipment>(command.CreateDto);

        _repository.AddShipment(shipment);
        await _uow.SaveChangesAsync(ct);

        ShipmentDto dto = _mapper.Map<ShipmentDto>(shipment);

        ShipmentLogInfo.LogShipmentCreated(_logger, dto.Id, default);
        return Result<ShipmentDto>.Success(dto);
    }
}
