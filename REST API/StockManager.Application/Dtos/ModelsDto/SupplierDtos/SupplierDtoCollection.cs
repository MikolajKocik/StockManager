namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierDtoCollection
{
    public required IReadOnlyCollection<SupplierDto> Data { get; init; }
        = Array.Empty<SupplierDto>();
}

