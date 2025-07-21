using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Core.Domain.Models.BinLocationEntity;

public sealed class BinLocation : Entity<int>
{
    public Warehouse Warehouse { get; private set; }     
    public string Code { get; private set; }             
    public string Description { get; private set; }

    // relation 1-* with inventoryItems
    private readonly List<InventoryItem> _inventoryItems = new();
    public IReadOnlyCollection<InventoryItem> InventoryItems
        => _inventoryItems.AsReadOnly();

    private BinLocation() {}

    public BinLocation(
        Warehouse warehouse,
        string code,
        string description
        ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(code, description);
        Guard.AgainstInvalidEnumValue(warehouse);

        Warehouse = warehouse;
        Code = code;
        Description = description;
    }

    public BinLocation(
        int id,
      Warehouse warehouse,
      string code,
      string description
      ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(code, description);
        Guard.AgainstInvalidEnumValue(warehouse);

        Warehouse = warehouse;
        Code = code;
        Description = description;
    }
}
