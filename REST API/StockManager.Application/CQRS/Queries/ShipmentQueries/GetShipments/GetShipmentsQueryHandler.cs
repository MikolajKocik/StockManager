using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;

public sealed class GetShipmentsQueryHandler(
        IShipmentRepository shipmentRepository,
        IMapper mapper  
    ) : IQueryHandler<GetShipmentsQuery, IReadOnlyList<ShipmentDto>>
{
    private readonly IShipmentRepository _shipmentRepository = shipmentRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<ShipmentDto>>> Handle(GetShipmentsQuery query, CancellationToken ct)
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

        List<ShipmentDto> dtos = await shipments
            .ProjectTo<ShipmentDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(s => s.ShippedDate)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return Result<IReadOnlyList<ShipmentDto>>.Success(dtos);
    }
}
