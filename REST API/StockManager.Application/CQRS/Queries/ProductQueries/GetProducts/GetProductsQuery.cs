using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;

public sealed record GetProductsQuery(
    string? Name,
    string? Warehouse,
    string? Genre,
    string? Unit,
    DateTime? ExpirationDate,
    DateTime? DeliveredAt
    ) : IQuery<IEnumerable<ProductDto>>;
