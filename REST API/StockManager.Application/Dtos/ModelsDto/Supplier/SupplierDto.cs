using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Dtos.ModelsDto.Supplier;


public sealed class SupplierDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public AddressDto? Address { get; set; }
    public Guid? AddressId { get; set; }
    public List<ProductDto>? Products { get; set; }
}

