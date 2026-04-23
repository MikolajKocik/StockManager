using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.StatisticsDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.StatisticsQueries;

public sealed class GetStockDistributionQueryHandler : IQueryHandler<GetStockDistributionQuery, IEnumerable<StockDistributionDto>>
{
    private readonly IProductRepository _productRepository;

    public GetStockDistributionQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Result<IEnumerable<StockDistributionDto>>> Handle(GetStockDistributionQuery query, CancellationToken cancellationToken)
    {
        var distribution = await _productRepository.GetProducts()
            .GroupBy(p => p.Genre)
            .Select(g => new StockDistributionDto(g.Key.ToString(), g.Count()))
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<StockDistributionDto>>.Success(distribution);
    }
}
