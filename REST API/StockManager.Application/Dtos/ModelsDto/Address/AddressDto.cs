﻿namespace StockManager.Application.Dtos.ModelsDto.Address;

public sealed class AddressDto
{
    public Guid Id { get; set; }
    public required string City { get; set; } 
    public required string Country { get; set; }
    public required string PostalCode { get; set; } 
    public Guid SupplierId { get; set; }
}
