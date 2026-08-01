using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.StatisticsDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.StatisticsQueries;

public sealed class GetStockDistributionQueryHandler(
    IProductRepository productRepository) : IQueryHandler<GetStockDistributionQuery, ICollection<StockDistributionDto>>
{
    private readonly IProductRepository _productRepository = productRepository;

    public async Task<Result<ICollection<StockDistributionDto>>> Handle(GetStockDistributionQuery query, CancellationToken ct)
    {
        List<StockDistributionDto> distribution = await _productRepository.GetProducts()
            .GroupBy(p => p.Genre)
            .Select(g => new StockDistributionDto(
                g.Key.ToString(),
                g.Count() * 1000))
            .ToListAsync(ct);

        return Result<ICollection<StockDistributionDto>>.Success(distribution);
    }
}
