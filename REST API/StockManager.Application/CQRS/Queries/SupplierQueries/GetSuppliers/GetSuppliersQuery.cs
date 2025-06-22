using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Dtos.ModelsDto.Supplier;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;

public sealed record GetSuppliersQuery(
    string? Name,
    AddressDto? Address,
    IEnumerable<ProductDto>? products) : IQuery<IEnumerable<SupplierDto>> { }
