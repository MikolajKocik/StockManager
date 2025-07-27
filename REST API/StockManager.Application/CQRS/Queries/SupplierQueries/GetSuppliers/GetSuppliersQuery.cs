using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;

public sealed record GetSuppliersQuery(
    string? Name,
    AddressDto? Address,
    IEnumerable<ProductDto>? products) : IQuery<IEnumerable<SupplierDto>> { }
