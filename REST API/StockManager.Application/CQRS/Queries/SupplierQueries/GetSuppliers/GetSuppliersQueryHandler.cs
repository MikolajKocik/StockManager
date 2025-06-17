using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Abstractions.CQRS.Query.QueryHelpers.Supplier;
using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers
{
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

        public async Task<Result<IEnumerable<SupplierDto>>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            _logger.LogInformation("Preparing suppliers data for use.");

            // adding list of product ids to supplier query if products field provided
            var productIds = request.products?.Any() is true 
                ? request.products?.Select(p => p.Id).ToList() 
                : null;

            var suppliers = _supplierRepository.GetSuppliers()
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(request.Name),
                    s => EF.Functions.Like(s.Name, $"%{request.Name}%"))
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(request.Address?.City),
                    s => EF.Functions.Like(s.Address.City, $"%{request.Address!.City}%"))
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(request.Address?.Country),
                    s => EF.Functions.Like(s.Address.Country, $"%{request.Address!.Country}%"))
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(request.Address?.PostalCode),
                    s => EF.Functions.Like(s.Address.PostalCode, $"%{request.Address!.PostalCode}%"))
                .IfHasValue(
                    productIds is not null,
                    s => s.Products.Any(p => productIds.Contains(p.Id)));

            var result = _mapper.Map<IEnumerable<SupplierDto>>(await suppliers.ToListAsync());

            _logger.LogInformation("Mapping suppliers collection successfull");

            return Result<IEnumerable<SupplierDto>>.Success(
                result.Any() 
                ? result
                : Enumerable.Empty<SupplierDto>());
        }
    }
}
