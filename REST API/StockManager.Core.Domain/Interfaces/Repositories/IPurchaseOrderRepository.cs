using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IPurchaseOrderRepository
{
    IQueryable<PurchaseOrder> GetPurchaseOrders();
    void AddPurchaseOrder(PurchaseOrder purchaseOrder);    
    Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(int id, CancellationToken ct = default);
    Task DeletePurchaseOrder(int id, CancellationToken ct = default);
}
