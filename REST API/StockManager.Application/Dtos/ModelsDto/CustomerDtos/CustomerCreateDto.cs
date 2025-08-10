using System;

namespace StockManager.Application.Dtos.ModelsDto.CustomerDtos;

public sealed record CustomerCreateDto
{
    public required string Name { get; init; }
    public required string TaxId { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public Guid AddressId { get; init; }
}

