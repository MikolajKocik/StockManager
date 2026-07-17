using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

namespace StockManager.Application.CQRS.Queries.SalesOrderQueries;

public sealed record GetSalesOrdersQuery(int Page = 1, int PageSize = 50) : IQuery<IReadOnlyList<SalesOrderDto>>;
