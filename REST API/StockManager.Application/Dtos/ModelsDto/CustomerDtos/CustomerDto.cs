using System;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Dtos.ModelsDto.CustomerDtos;

public sealed record CustomerDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public required string TaxId { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public Guid AddressId { get; init; }
    public AddressDto? Address { get; init; }
}

