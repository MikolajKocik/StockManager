using System;

namespace StockManager.Application.Dtos.ModelsDto.Supplier;

public sealed record SupplierUpdateDto
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public Guid? AddressId { get; init; }
}
