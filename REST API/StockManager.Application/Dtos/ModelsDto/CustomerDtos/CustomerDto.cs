using System;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Dtos.ModelsDto.CustomerDtos;

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

