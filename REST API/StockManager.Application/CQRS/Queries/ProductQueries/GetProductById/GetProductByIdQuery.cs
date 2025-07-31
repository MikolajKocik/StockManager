using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;

public sealed class GetProductByIdQuery : IQuery<ProductDto>
{
    public int Id { get; set; }

    public GetProductByIdQuery(int id)
    {
        Id = id;
    }
}
