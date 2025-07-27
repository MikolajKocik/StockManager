using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Dtos.ModelsDto.SupplierDtos;

public sealed record SupplierDto
{
    public Guid Id { get; }
    public string Name { get; }
    public string Slug { get; }
    public AddressDto? Address { get; }
    public Guid? AddressId { get; }
}

