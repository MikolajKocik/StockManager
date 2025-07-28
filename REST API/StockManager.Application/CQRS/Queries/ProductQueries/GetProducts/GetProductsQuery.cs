using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;

public sealed record GetProductsQuery(
    string? Name,
    string? Warehouse,
    string? Genre,
    string? Unit,
    DateTime? ExpirationDate,
    DateTime? DeliveredAt,
    int PageNumber = 1,
    int PageSize = 10
    ) : IQuery<IEnumerable<ProductDto>>;
