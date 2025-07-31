namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierDtoCollection
{
    public required IEnumerable<SupplierDto> Data { get; init; }
}

