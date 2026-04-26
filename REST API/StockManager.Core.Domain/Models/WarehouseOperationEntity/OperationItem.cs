using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.WarehouseOperationEntity;

public sealed class OperationItem : Entity<int>
{
    public int OperationId { get; private set; }
    public int ProductId { get; private set; }
    public decimal Quantity { get; private set; }

    internal OperationItem(int operationId, int productId, decimal quantity) : base()
    {
        Guard.AgainstDefaultValue(productId);
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
        }
        
        OperationId = operationId;
        ProductId = productId;
        Quantity = quantity;
    }

    private OperationItem() : base() { }
}
