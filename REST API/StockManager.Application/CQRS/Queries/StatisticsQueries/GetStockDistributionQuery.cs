using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.StatisticsDtos;

namespace StockManager.Application.CQRS.Queries.StatisticsQueries;

public sealed record GetStockDistributionQuery() : IQuery<IEnumerable<StockDistributionDto>>;
