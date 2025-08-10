namespace StockManager.Application.Dtos.ModelsDto.ProductDtos;

public sealed record ProductDtoCollection
{
    public required IReadOnlyCollection<ProductDto> Data { get; init; }
        = Array.Empty<ProductDto>();
}
