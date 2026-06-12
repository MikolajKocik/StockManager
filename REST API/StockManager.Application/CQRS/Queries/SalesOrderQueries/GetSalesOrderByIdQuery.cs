using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

namespace StockManager.Application.CQRS.Queries.SalesOrderQueries;

public sealed record GetSalesOrderByIdQuery(int Id) : IQuery<SalesOrderDto>;
