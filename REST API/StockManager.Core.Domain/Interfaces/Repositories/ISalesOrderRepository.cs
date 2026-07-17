using StockManager.Core.Domain.Models.SalesOrderEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISalesOrderRepository : IBaseRepository
{
    IQueryable<SalesOrder> GetSalesOrders();

    Task<SalesOrder?> GetSalesOrderByIdAsync(int id, CancellationToken ct);

    void AddSalesOrder(SalesOrder order);

    Task DeleteSalesOrderAsync(int id, CancellationToken ct = default);
}
