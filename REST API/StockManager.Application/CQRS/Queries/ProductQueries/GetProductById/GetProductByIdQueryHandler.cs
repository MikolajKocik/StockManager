using AutoMapper;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById
{
    public class GetProductByIdQueryHandler : IQueryHandler<GetProductByIdQuery, ProductDto>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;
        public GetProductByIdQueryHandler(IMapper mapper, IProductRepository repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<Result<ProductDto>> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var product = await _repository.GetProductByIdAsync(query.Id, cancellationToken);

            if (product is null)
            {
                var error = new Error(
                    $"Product with id: {query.Id} not found",
                    ErrorCodes.ProductNotFound
                );

                return Result<ProductDto>.Failure(error);
            }

            var dto = _mapper.Map<ProductDto>(product);

            return Result<ProductDto>.Success(dto);
        }
    }
}
