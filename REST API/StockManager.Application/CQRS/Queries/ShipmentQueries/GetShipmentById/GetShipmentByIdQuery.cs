using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipmentById;

public sealed record GetShipmentByIdQuery(
    int Id
    ) : IQuery<ShipmentDto>;

