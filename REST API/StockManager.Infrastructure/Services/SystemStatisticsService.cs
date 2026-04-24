using System.Threading;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public sealed class SystemStatisticsService : ISystemStatisticsService
{
    private long _totalApiRequests;
    private long _processedOperations;

    public long TotalApiRequests => Interlocked.Read(ref _totalApiRequests);
    public long ProcessedOperations => Interlocked.Read(ref _processedOperations);

    public void IncrementApiRequests()
    {
        Interlocked.Increment(ref _totalApiRequests);
    }

    public void IncrementProcessedOperations()
    {
        Interlocked.Increment(ref _processedOperations);
    }
}
