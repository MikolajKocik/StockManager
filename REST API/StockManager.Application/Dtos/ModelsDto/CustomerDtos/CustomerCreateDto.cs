using System;

namespace StockManager.Application.Dtos.ModelsDto.CustomerDtos;

public sealed record CustomerCreateDto
{
    public string Name { get; init; }
    public string TaxId { get; init; }
    public string Email { get; init; }
    public string Phone { get; init; }
    public Guid AddressId { get; init; }
}

