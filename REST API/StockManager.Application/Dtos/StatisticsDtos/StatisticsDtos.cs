namespace StockManager.Application.Dtos.StatisticsDtos;

public sealed record OperationsTrendDto(DateTime Date, int Count);
public sealed record StockDistributionDto(string Label, int Count);
