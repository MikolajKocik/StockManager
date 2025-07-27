using System;

namespace StockManager.Application.Dtos.ModelsDto.Customer;

public sealed record CustomerUpdateDto
{
    public int Id { get; init; }
    public string? Name { get; init; }
    public string? TaxId { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public Guid? AddressId { get; init; }
}

