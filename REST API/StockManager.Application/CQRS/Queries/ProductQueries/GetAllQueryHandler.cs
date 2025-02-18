using AutoMapper;
using MediatR;
using StockManager.Application.Dtos;
using StockManager.Core.Domain.Interfaces;

namespace StockManager.Application.CQRS.Queries.ProductQueries
{
    public class GetAllQueryHandler : IRequestHandler<GetAllQuery, IEnumerable<ProductDto>>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;

        public GetAllQueryHandler(IMapper mapper, IProductRepository repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<IEnumerable<ProductDto>> Handle(GetAllQuery request, CancellationToken cancellationToken)
        {
            var products = await _repository.GetProducts(cancellationToken);

            if (products == null)
            {
                return Enumerable.Empty<ProductDto>();
            }

            var dtos = _mapper.Map<IEnumerable<ProductDto>>(products);

            return dtos;

        }
    }
}
