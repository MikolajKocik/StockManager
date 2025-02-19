using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public int Id { get; set; }

        public GetProductByIdQuery(int id)
        {
            Id = id;
        }
    }
}
