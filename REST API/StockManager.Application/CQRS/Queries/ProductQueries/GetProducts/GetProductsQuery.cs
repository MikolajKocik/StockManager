using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Core.Application.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts
{
    public sealed record GetProductsQuery(
        string? Name,
        string? Genre,
        string? Unit,
        DateTime? ExpirationDate,
        DateTime? DeliveredAt
        ) : IQuery<IEnumerable<ProductDto>>;
}
