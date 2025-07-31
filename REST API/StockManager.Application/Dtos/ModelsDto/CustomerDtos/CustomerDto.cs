using System;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Dtos.ModelsDto.CustomerDtos;

public sealed record CustomerDto
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string TaxId { get; init; }
    public string Email { get; init; }
    public string Phone { get; init; }
    public Guid AddressId { get; init; }
    public AddressDto? Address { get; init; }
}

