using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries
{
    public record GetProductsQuery(
        string? Name,
        string? Genre,
        string? Unit,
        DateTime? ExpirationDate,
        DateTime? DeliveredAt
        ) : IRequest<IEnumerable<ProductDto>>;
}
