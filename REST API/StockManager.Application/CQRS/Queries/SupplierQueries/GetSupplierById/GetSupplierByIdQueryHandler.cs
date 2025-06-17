using AutoMapper;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById
{
    public sealed class GetSupplierByIdQueryHandler : IQueryHandler<GetSupplierByIdQuery, SupplierDto>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IMapper _mapper;

        public GetSupplierByIdQueryHandler(ISupplierRepository supplierRepository, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _mapper = mapper;
        }
        public async Task<Result<SupplierDto>> Handle(GetSupplierByIdQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var getSupplier = await _supplierRepository.GetSupplierByIdAsync(query.Id, cancellationToken);

            if(getSupplier is null)
            {
                var error = new Error(
                    $"Supplier with provided id : {query.Id} not found",
                    ErrorCodes.SupplierNotFound
                );

                return Result<SupplierDto>.Failure(error);
            }

            var dto = _mapper.Map<SupplierDto>(getSupplier);

            return Result<SupplierDto>.Success(dto);
        }
    }
}
