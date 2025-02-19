using AutoMapper;
using MediatR;
using StockManager.Application.Dtos;
using StockManager.Core.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts
{
    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;

        public GetProductsQueryHandler(IMapper mapper, IProductRepository repository)   
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {

            var products = _repository.GetProducts(); // product with IQueryable

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                products = products.Where(p => p.Name.Contains(request.Name, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(request.Genre))
            {
                products = products.Where(p => p.Genre.ToString().ToLower() == request.Genre.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(request.Unit))
            {
                products = products.Where(p => p.Unit != null && p.Unit.Contains(request.Unit, StringComparison.OrdinalIgnoreCase));
            }

            if (request.ExpirationDate.HasValue)
            {
                products = products.Where(p => p.ExpirationDate.Date == request.ExpirationDate.Value.Date);
            }
            else
            {
                DateTime soon = DateTime.Today.AddDays(14); 
                products = products.Where(p => p.ExpirationDate >= DateTime.Today && p.ExpirationDate <= soon);

            }

            if (request.DeliveredAt.HasValue)
            {
                products = products.Where(p => p.DeliveredAt == request.DeliveredAt.Value.Date);
            }

            var dtos = _mapper.Map<IEnumerable<ProductDto>>(await products.ToListAsync(cancellationToken));

            return dtos.Any() ? dtos : Enumerable.Empty<ProductDto>();

        }
    }
}
