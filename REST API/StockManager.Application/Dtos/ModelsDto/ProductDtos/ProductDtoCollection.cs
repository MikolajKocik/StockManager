namespace StockManager.Application.Dtos.ModelsDto.ProductDtos;

public sealed record ProductDtoCollection
{
    public required IEnumerable<ProductDto> Data { get; init; }
}
