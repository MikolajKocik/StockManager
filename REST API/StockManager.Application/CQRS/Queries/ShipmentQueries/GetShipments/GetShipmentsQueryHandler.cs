using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;

public class GetShipmentsQueryHandler : IRequestHandler<GetShipmentsQuery, IEnumerable<ShipmentDto>>
{
    private readonly IShipmentRepository _shipmentRepository;
    private readonly IShipmentService _shipmentService;
    private readonly IMapper _mapper;
    private readonly ILogger<GetShipmentsQueryHandler> _logger;

    public GetShipmentsQueryHandler(
        IShipmentRepository shipmentRepository,
        IShipmentService shipmentService,
        IMapper mapper,
        ILogger<GetShipmentsQueryHandler> logger)
    {
        _shipmentRepository = shipmentRepository;
        _shipmentService = shipmentService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<ShipmentDto>> Handle(GetShipmentsQuery query, CancellationToken cancellationToken)
    {
        var shipments = await _shipmentRepository.GetShipmentsAsync(
            query.SalesOrderId,
            query.TrackingNumber,
            query.Status,
            query.ShippedDate,
            query.DeliveredDate,
            query.PageNumber,
            query.PageSize,
            cancellationToken);

        return _mapper.Map<IEnumerable<ShipmentDto>>(shipments);
    }
}
