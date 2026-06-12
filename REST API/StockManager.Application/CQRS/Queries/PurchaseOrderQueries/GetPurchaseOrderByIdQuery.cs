using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed record GetPurchaseOrderByIdQuery(int Id) : IQuery<PurchaseOrderDto>;
