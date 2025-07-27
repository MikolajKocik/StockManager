using System;

namespace StockManager.Application.Dtos.ModelsDto.Customer;

public sealed record CustomerDto
{
    public int Id { get; }
    public string Name { get; }
    public string TaxId { get; }
    public string Email { get; }
    public string Phone { get; }
    public Guid AddressId { get; }
    public AddressDto? Address { get; }
}

