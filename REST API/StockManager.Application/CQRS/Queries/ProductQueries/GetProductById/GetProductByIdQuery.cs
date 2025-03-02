using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;

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
