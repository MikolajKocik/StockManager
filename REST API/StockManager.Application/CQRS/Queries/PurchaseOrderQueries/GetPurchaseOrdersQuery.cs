using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed record GetPurchaseOrdersQuery(int Page = 1, int PageSize = 50) 
    : IQuery<IReadOnlyList<PurchaseOrderDto>>;
