using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierDto
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Slug { get; init; }
    public AddressDto? Address { get; init; }
    public Guid? AddressId { get; init; }
}

