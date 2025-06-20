using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Abstractions.CQRS.Query.QueryHelpers.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;

public sealed class GetSuppliersQueryHandler : IQueryHandler<GetSuppliersQuery, IEnumerable<SupplierDto>>
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetSuppliersQueryHandler> _logger;

    public GetSuppliersQueryHandler(
        ISupplierRepository supplierRepository,
        IMapper mapper,
        ILogger<GetSuppliersQueryHandler> logger)
    {
        _supplierRepository = supplierRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<IEnumerable<SupplierDto>>> Handle(GetSuppliersQuery query, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Preparing suppliers data for use.");

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

        _logger.LogInformation("Mapping suppliers collection successfull");

        return Result<IEnumerable<SupplierDto>>.Success(
            result.Any() 
            ? result
            : Enumerable.Empty<SupplierDto>());
    }
}
