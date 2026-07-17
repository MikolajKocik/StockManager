using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;

public sealed class GetSuppliersQueryHandler(
    ISupplierRepository supplierRepository,
    IMapper mapper) : IQueryHandler<GetSuppliersQuery, IReadOnlyList<SupplierDto>>
{
    private readonly ISupplierRepository _supplierRepository = supplierRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<SupplierDto>>> Handle(GetSuppliersQuery query, CancellationToken ct)
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

        List<SupplierDto> dtos = await suppliers
            .ProjectTo<SupplierDto>(_mapper.ConfigurationProvider)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return Result<IReadOnlyList<SupplierDto>>.Success(dtos);
    }
}
