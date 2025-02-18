using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries
{
    public class GetAllQuery : IRequest<ProductDto>
    {
    }
}
