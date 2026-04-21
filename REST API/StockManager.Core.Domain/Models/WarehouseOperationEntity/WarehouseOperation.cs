using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.WarehouseOperationEntity;

public sealed class WarehouseOperation : Entity<int>
{
    public OperationType Type { get; private set; }
    public OperationStatus Status { get; private set; }
    public DateTime Date { get; private set; }
    public string Description { get; private set; }

    private readonly List<OperationItem> _items = new();
    public IReadOnlyCollection<OperationItem> Items => _items.AsReadOnly();

    public WarehouseOperation(
        OperationType type,
        DateTime date,
        string description = "") : base()
    {
        Guard.AgainstInvalidEnumValue(type);
        Guard.AgainstDefaultValue(date);

        Type = type;
        Date = date;
        Status = OperationStatus.Pending;
        Description = description;
    }

    private WarehouseOperation() : base() { }

    public void AddItem(int productId, decimal quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

        _items.Add(new OperationItem(Id, productId, quantity));
    }

    public void Complete()
    {
        if (Status != OperationStatus.Pending)
            throw new InvalidOperationException("Only pending operations can be completed.");

        Status = OperationStatus.Completed;
    }

    public void Cancel()
    {
        if (Status != OperationStatus.Pending)
            throw new InvalidOperationException("Only pending operations can be cancelled.");

        Status = OperationStatus.Cancelled;
    }
}
