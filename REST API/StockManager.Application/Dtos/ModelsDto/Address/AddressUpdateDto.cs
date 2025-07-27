using System;

namespace StockManager.Application.Dtos.ModelsDto.Address;

public sealed record AddressUpdateDto
{
    public Guid Id { get; init; }
    public required string City { get; init; }
    public required string Country { get; init; }
    public required string PostalCode { get; init; }
    public Guid? SupplierId { get; init; }
    public int? CustomerId { get; init; }
}   

