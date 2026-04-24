using System;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface ISystemStatisticsService
{
    long TotalApiRequests { get; }
    long ProcessedOperations { get; }
    void IncrementApiRequests();
    void IncrementProcessedOperations();
}