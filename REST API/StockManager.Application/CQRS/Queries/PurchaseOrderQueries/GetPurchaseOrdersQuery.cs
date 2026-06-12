using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed record GetPurchaseOrdersQuery : IQuery<List<PurchaseOrderDto>>;
