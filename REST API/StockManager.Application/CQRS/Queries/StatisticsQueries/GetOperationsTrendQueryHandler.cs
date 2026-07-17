using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.StatisticsDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.StatisticsQueries;

public sealed class GetOperationsTrendQueryHandler(IWarehouseOperationRepository operationRepository)
    : IQueryHandler<GetOperationsTrendQuery, IEnumerable<OperationsTrendDto>>
{
    private readonly IWarehouseOperationRepository _operationRepository = operationRepository;

    public async Task<Result<IEnumerable<OperationsTrendDto>>> Handle(GetOperationsTrendQuery query, CancellationToken cancellationToken)
    {
        DateTime startDate = DateTime.UtcNow.Date.AddDays(-query.Days);

        var trendData = await _operationRepository.GetOperations()
            .Where(o => o.Date >= startDate)
            .GroupBy(o => o.Date.Date)
            .Select(g => new { 
                Date = g.Key, 
                Count = g.Count() 
            })
            .OrderBy(o => o.Date)
            .ToListAsync(cancellationToken);

        IEnumerable<OperationsTrendDto> trend = trendData.Select(x => new OperationsTrendDto(x.Date, x.Count));

        return Result<IEnumerable<OperationsTrendDto>>.Success(trend);
    }
}
