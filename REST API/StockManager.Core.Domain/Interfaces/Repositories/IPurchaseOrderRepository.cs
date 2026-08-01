using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IPurchaseOrderRepository : IBaseRepository
{
    IQueryable<PurchaseOrder> GetPurchaseOrders();
    void AddPurchaseOrder(PurchaseOrder purchaseOrder);    
    Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(int id, CancellationToken ct = default);
    Task DeletePurchaseOrder(int id, CancellationToken ct = default);
}
