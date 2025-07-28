using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;

public class GetProductsQueryHandler : IQueryHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;

    public GetProductsQueryHandler(IMapper mapper, IProductRepository repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<Result<IEnumerable<ProductDto>>> Handle(GetProductsQuery query, CancellationToken cancellationToken)
    {
        IQueryable<Product> products = _repository.GetProducts()
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Name),
                p => EF.Functions.Like(p.Name, $"%{query.Name}%"))
            .IfHasValue(
                !string.IsNullOrWhiteSpace(query.Unit),
                p => p.Unit != null && EF.Functions.Like(p.Unit, $"%{query.Unit}%"))
            .IfHasValue(
                query.DeliveredAt.HasValue,
                p => p.DeliveredAt.Date == query.DeliveredAt!.Value.Date); 


        if (!string.IsNullOrWhiteSpace(query.Warehouse))
        {
            if (Enum.TryParse(query.Warehouse, true, out Warehouse warehouse))
            {

                products = products.Where(p => p.Type == warehouse);
            }
        }

        if (!string.IsNullOrWhiteSpace(query.Genre))
        {
            if (Enum.TryParse(query.Genre, true, out Genre genre))
            {
                products = products.Where(p => p.Genre == genre);
            }
        }

        if (query.ExpirationDate.HasValue)
        {
            products = products.Where(p => p.ExpirationDate.Date == query.ExpirationDate.Value.Date);
        }
        else
        {
            DateTime soon = DateTime.Today.AddDays(14);
            products = products.Where(p => p.ExpirationDate >= DateTime.Today && p.ExpirationDate <= soon);
        }

        IEnumerable<ProductDto> dtos = await products
                 .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                 .Skip((query.PageNumber - 1) * query.PageSize)
                 .Take(query.PageSize)
                 .ToListAsync(cancellationToken);

        return Result<IEnumerable<ProductDto>>.Success(
            dtos.Any() ? dtos : Enumerable.Empty<ProductDto>());
    }
}
