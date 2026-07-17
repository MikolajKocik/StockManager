using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;

public sealed record GetProductByIdQuery(int Id) : IQuery<ProductDto>;
