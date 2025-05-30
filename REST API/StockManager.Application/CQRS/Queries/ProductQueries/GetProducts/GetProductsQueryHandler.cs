﻿using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using StockManager.Models;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Dtos.ModelsDto;

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
            cancellationToken.ThrowIfCancellationRequested();

            var products = _repository.GetProducts(); // product with IQueryable

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                products = products.Where(p => EF.Functions.Like(p.Name, $"%{request.Name}%"));
            }

            if (!string.IsNullOrWhiteSpace(request.Genre))
            {
                if (Enum.TryParse<Genre>(request.Genre, true, out var genre))
                {
                    products = products.Where(p => p.Genre == genre);
                }
            }

            if (!string.IsNullOrWhiteSpace(request.Unit))
            {
                products = products.Where(p => p.Unit != null && EF.Functions.Like(p.Unit, $"%{request.Unit}%"));
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
                products = products.Where(p => p.DeliveredAt.Date == request.DeliveredAt.Value.Date);
            }

            var dtos = _mapper.Map<IEnumerable<ProductDto>>(await products.ToListAsync(cancellationToken));

            return dtos.Any() ? dtos : Enumerable.Empty<ProductDto>();
        }
    }
}
