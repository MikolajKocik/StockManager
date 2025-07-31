using System;

namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierCreateDto
{
    public string Name { get; init; }
    public Guid AddressId { get; init; }
}
