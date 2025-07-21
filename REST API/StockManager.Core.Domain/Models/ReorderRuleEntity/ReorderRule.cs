using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Core.Domain.Models.ReorderRuleEntity;

public sealed class ReorderRule : Entity<int>
{
    public Warehouse Warehouse { get; private set; }
    public decimal MinLevel { get; private set; }
    public decimal MaxLevel { get; private set; }

    // relation *-1 with product 
    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    private ReorderRule() : base() { } 

    public ReorderRule(
        int productId, 
        Warehouse warehouse,
        decimal minLevel,
        decimal maxLevel
        ) : base()
    {
        Guard.AgainstDefaultValue(productId);
        Guard.AgainstInvalidEnumValue(warehouse);

        ValidateLevels(minLevel, maxLevel);

        ProductId = productId;
        Warehouse = warehouse;
        MinLevel = minLevel;
        MaxLevel = maxLevel;
    }

    public ReorderRule(
        int id,
        int productId,
        Warehouse warehouse,
        decimal minLevel,
        decimal maxLevel
        ) : base(id)
    {
        Guard.AgainstDefaultValue(productId);
        Guard.AgainstInvalidEnumValue(warehouse);

        ValidateLevels(minLevel, maxLevel);

        ProductId = productId;
        Warehouse = warehouse;
        MinLevel = minLevel;
        MaxLevel = maxLevel;
    }

    private void ValidateLevels(decimal minLevel, decimal maxLevel)
    {
        if (minLevel < 0)
        {
            throw new ArgumentException("MinLevel must be ≥ 0", nameof(minLevel));
        }

        if (maxLevel < minLevel)
        {
            throw new ArgumentException("MaxLevel must be ≥ MinLevel", nameof(maxLevel));
        }
    }
}
