using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipmentById;

public class GetShipmentByIdQueryHandler : IRequestHandler<GetShipmentByIdQuery, IEnumerable<ShipmentDto>>
{
    private readonly IShipmentRepository _shipmentRepository;
    private readonly IShipmentService _shipmentService;
    private readonly IMapper _mapper;
    private readonly ILogger<GetShipmentByIdQueryHandler> _logger;

    public GetShipmentByIdQueryHandler(
        IShipmentRepository shipmentRepository,
        IShipmentService shipmentService,
        IMapper mapper,
        ILogger<GetShipmentByIdQueryHandler> logger)
    {
        _shipmentRepository = shipmentRepository;
        _shipmentService = shipmentService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<ShipmentDto>> Handle(GetShipmentByIdQuery query, CancellationToken cancellationToken)
    {
        var shipments = await _shipmentRepository.GetShipmentByIdPagedAsync(
            query.Id,
            query.PageNumber,
            query.PageSize,
            cancellationToken);

        return _mapper.Map<IEnumerable<ShipmentDto>>(shipments);
    }
}
