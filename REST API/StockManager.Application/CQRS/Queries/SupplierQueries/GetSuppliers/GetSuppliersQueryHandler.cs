using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;
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
                s => EF.Functions.Like(s.Address.PostalCode, $"%{query.Address!.PostalCode}%"));

        IEnumerable<SupplierDto> dtos = await suppliers
            .ProjectTo<SupplierDto>(_mapper.ConfigurationProvider)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<SupplierDto>>.Success(
            dtos.Any() 
            ? dtos
            : Enumerable.Empty<SupplierDto>());
    }
}
