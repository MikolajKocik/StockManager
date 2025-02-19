using AutoMapper;
using MediatR;
using StockManager.Application.Dtos;
using StockManager.Core.Domain.Interfaces;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;
        public GetProductByIdQueryHandler(IMapper mapper, IProductRepository repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var product = await _repository.GetProductById(request.Id, cancellationToken);

            var dtos = _mapper.Map<ProductDto>(product);

            return dtos;
        }
    }
}
