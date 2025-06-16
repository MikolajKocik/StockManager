using AutoMapper;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common;
using StockManager.Core.Application.Dtos.ModelsDto;
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

        public async Task<Result<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var product = await _repository.GetProductByIdAsync(request.Id, cancellationToken);

            var dto = _mapper.Map<ProductDto?>(product);

            if (dto is not null)
            {
                return Result<ProductDto>.Success(dto);

            }
            else
            {
                var error = new Error(
                    $"Product with id: {product.Id} not found",
                    code: "Product.NotFound"
                );

                return Result<ProductDto>.Failure(error);
            }
        }
    }
}
