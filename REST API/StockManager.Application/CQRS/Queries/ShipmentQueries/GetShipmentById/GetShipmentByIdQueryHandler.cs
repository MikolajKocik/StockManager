using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipmentById;

public class GetShipmentByIdQueryHandler : IQueryHandler<GetShipmentByIdQuery, ShipmentDto>
{
    private readonly IShipmentRepository _shipmentRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetShipmentByIdQueryHandler> _logger;

    public GetShipmentByIdQueryHandler(
        IShipmentRepository shipmentRepository,
        IMapper mapper,
        ILogger<GetShipmentByIdQueryHandler> logger)
    {
        _shipmentRepository = shipmentRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<ShipmentDto>> Handle(GetShipmentByIdQuery query, CancellationToken cancellationToken)
    {

        Shipment? shipment = await _shipmentRepository.GetShipmentByIdAsync(query.Id, cancellationToken);

        if (shipment is null)
        {
            ShipmentLogWarning.LogShipmentNotFound(_logger, query.Id, default);

            var error = new Error(
                $"Shipment with ID {query.Id} not found.",
                ErrorCodes.ShipmentNotFound
            );

            return Result<ShipmentDto>.Failure(error);
        }

        ShipmentDto dto = _mapper.Map<ShipmentDto>(shipment);
        ShipmentLogInfo.LogShipmentFound(_logger, query.Id, default);

        return Result<ShipmentDto>.Success(dto);
    }
}
