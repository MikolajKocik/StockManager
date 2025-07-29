using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder> AddPurchaseOrderAsync(PurchaseOrder entity, CancellationToken cancellationToken);
    Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(int id, CancellationToken cancellationToken);
    Task<PurchaseOrder> UpdatePurchaseOrderAsync(PurchaseOrder entity, CancellationToken cancellationToken);
    Task<PurchaseOrder> DeletePurchaseOrderAsync(PurchaseOrder entity, CancellationToken cancellationToken);
}
