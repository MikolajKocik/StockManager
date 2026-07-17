using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItemById;

public sealed record GetInventoryItemByIdQuery(int Id) : IQuery<InventoryItemDto>;
