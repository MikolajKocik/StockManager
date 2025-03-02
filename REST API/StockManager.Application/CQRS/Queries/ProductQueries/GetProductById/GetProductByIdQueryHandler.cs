using AutoMapper;
using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;
using StockManager.Core.Domain.Exceptions;
using StockManager.Core.Domain.Interfaces.Repositories;

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

            var product = await _repository.GetProductByIdAsync(request.Id, cancellationToken);

            var dto = _mapper.Map<ProductDto?>(product);

            if (dto == null) throw new NotFoundException(nameof(ProductDto), request.Id.ToString());

            return dto;
        }
    }
}
