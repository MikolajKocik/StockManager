using Microsoft.Extensions.Logging;
namespace StockManager.Core.Domain.Interfaces.Common;

public interface IBaseRepository
{
    void LogAccess() => Console.WriteLine($"Last repository usage: {GetType().Name}");
}