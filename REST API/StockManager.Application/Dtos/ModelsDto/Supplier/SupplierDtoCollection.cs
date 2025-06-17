using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Dtos.ModelsDto.Supplier
{
    public sealed record SupplierDtoCollection
    {
        public required IEnumerable<SupplierDto> Data { get; init; }
    }
}

