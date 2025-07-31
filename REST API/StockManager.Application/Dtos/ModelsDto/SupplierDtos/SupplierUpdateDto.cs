using System;

namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierUpdateDto
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public Guid? AddressId { get; init; }
}
