using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Dtos.ModelsDto.Supplier;

public sealed record SupplierDto
{
    public Guid Id { get; }
    public string Name { get; }
    public string Slug { get; }
    public AddressDto? Address { get; }
    public Guid? AddressId { get; }
}

