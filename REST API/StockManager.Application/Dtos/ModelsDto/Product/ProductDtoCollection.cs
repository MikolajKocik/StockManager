namespace StockManager.Application.Dtos.ModelsDto.Product
{
    public sealed record ProductDtoCollection
    {
        public required IEnumerable<ProductDto> Data { get; init; }
    }
}
