using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;

public class GetShipmentsQueryHandler : IQueryHandler<GetShipmentsQuery, IEnumerable<ShipmentDto>>
{
    private readonly IShipmentRepository _shipmentRepository;
    private readonly IMapper _mapper;

    public GetShipmentsQueryHandler(
        IShipmentRepository shipmentRepository,
        IShipmentService shipmentService,
        IMapper mapper,
        ILogger<GetShipmentsQueryHandler> logger)
    {
        _shipmentRepository = shipmentRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<ShipmentDto>>> Handle(GetShipmentsQuery query, CancellationToken cancellationToken)
    {
        IQueryable<Shipment> shipments = _shipmentRepository.GetShipments()
             .IfHasValue(
                 !Equals(query.SalesOrderId, default),
                 s => s.SalesOrderId == query.SalesOrderId)
             .IfHasValue(
                 !string.IsNullOrWhiteSpace(query.TrackingNumber),
                 s => s.TrackingNumber == query.TrackingNumber);

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            if (Enum.TryParse(query.Status, true, out ShipmentStatus status))
            {

                shipments = shipments.Where(s => s.Status == status);
            }
        }

        if (query.ShippedDate.HasValue)
        {
            shipments = shipments.Where(p => p.ShippedDate.Date == query.ShippedDate.Value.Date);
        }

        if (query.DeliveredDate.HasValue)
        {
            shipments = shipments.Where(p => p.DeliveredDate == query.DeliveredDate.Value.Date);
        }

        IEnumerable<ShipmentDto> dtos = await shipments
                 .ProjectTo<ShipmentDto>(_mapper.ConfigurationProvider)
                 .Skip((query.PageNumber - 1) * query.PageSize)
                 .Take(query.PageSize)
                 .ToListAsync(cancellationToken);

        return Result<IEnumerable<ShipmentDto>>.Success(
            dtos.Any()
            ? dtos
            : Enumerable.Empty<ShipmentDto>());
    }
}
