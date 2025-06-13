using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts
{
    public sealed record GetProductsQuery(
        string? Name,
        string? Genre,
        string? Unit,
        DateTime? ExpirationDate,
        DateTime? DeliveredAt
        ) : IRequest<IEnumerable<ProductDto>>;
}
