using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Core.Application.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById
{
    public sealed class GetProductByIdQuery : IQuery<ProductDto>
    {
        public int Id { get; set; }

        public GetProductByIdQuery(int id)
        {
            Id = id;
        }
    }
}
