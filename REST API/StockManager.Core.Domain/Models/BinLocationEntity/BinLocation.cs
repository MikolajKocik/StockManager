using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Core.Domain.Models.BinLocationEntity;

public sealed class BinLocation
{
    public int Id { get; private set; }
    public Warehouse Warehouse { get; private set; }     

    public string Code { get; private set; }             
    public string Description { get; private set; }

    public ICollection<InventoryItem> InventoryItems { get; private set; }

    private BinLocation() {}
    public BinLocation(Warehouse warehouse, string code, string description)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new ArgumentException("Code required");
        }

        Warehouse = warehouse;
        Code = code;
        Description = description;
    }
}

