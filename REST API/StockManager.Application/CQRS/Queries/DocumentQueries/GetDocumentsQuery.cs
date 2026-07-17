using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed record GetDocumentsQuery(int Page = 1, int PageSize = 50) 
    : IQuery<IReadOnlyList<DocumentDto>>;
