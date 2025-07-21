using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;

public sealed class GetSuppliersQueryHandler : IQueryHandler<GetSuppliersQuery, IEnumerable<SupplierDto>>
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly IMapper _mapper;

    public GetSuppliersQueryHandler(
        ISupplierRepository supplierRepository,
        IMapper mapper
        )
    {
        _supplierRepository = supplierRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<SupplierDto>>> Handle(GetSuppliersQuery query, CancellationToken cancellationToken)
    {
        // adding list of product ids to supplier query if products field provided
        List<int>? productIds = query.products?.Any() is true 
            ? query.products?.Select(p => p.Id).ToList() 
            : null;

        IQueryable<Supplier> suppliers = _supplierRepository.GetSuppliers()
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Name),
                s => EF.Functions.Like(s.Name, $"%{query.Name}%"))
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Address?.City),
                s => EF.Functions.Like(s.Address.City, $"%{query.Address!.City}%"))
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Address?.Country),
                s => EF.Functions.Like(s.Address.Country, $"%{query.Address!.Country}%"))
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Address?.PostalCode),
                s => EF.Functions.Like(s.Address.PostalCode, $"%{query.Address!.PostalCode}%"))
            .IfHasValue(
                productIds is not null,
                s => s.Products.Any(p => productIds!.Contains(p.Id)));

        IEnumerable<SupplierDto> result = _mapper.Map<IEnumerable<SupplierDto>>(await suppliers.ToListAsync(cancellationToken));

        return Result<IEnumerable<SupplierDto>>.Success(
            result.Any() 
            ? result
            : Enumerable.Empty<SupplierDto>());
    }
}
