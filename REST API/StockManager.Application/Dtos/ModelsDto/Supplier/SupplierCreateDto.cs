using System;

namespace StockManager.Application.Dtos.ModelsDto.Supplier;

public sealed record SupplierCreateDto
{
    public string Name { get; init; }
    public Guid AddressId { get; init; }
}
