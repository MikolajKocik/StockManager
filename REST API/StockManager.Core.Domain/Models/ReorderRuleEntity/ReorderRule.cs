using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Core.Domain.Models.ReorderRuleEntity;

public sealed class ReorderRule
{
    public int Id { get; private set; }
    public Warehouse Warehouse { get; private set; }
    public decimal MinLevel { get; private set; }
    public decimal MaxLevel { get; private set; }

    // relation *-1 with product 
    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    private ReorderRule() { } 

    public ReorderRule(int productId, Warehouse warehouse, decimal minLevel, decimal maxLevel, Product product)
    {
        if (productId <= 0)
        {
            throw new ArgumentException(null, nameof(productId));
        }

        if (minLevel < 0)
        {
            throw new ArgumentException("MinLevel must be ≥ 0", nameof(minLevel));
        }

        if (maxLevel < minLevel)
        {
            throw new ArgumentException("MaxLevel must be ≥ MinLevel", nameof(maxLevel));
        }

        if (product is null)
        {
            throw new ArgumentNullException(nameof(product), "Product is required");
        }    

        ProductId = productId;
        Warehouse = warehouse;
        MinLevel = minLevel;
        MaxLevel = maxLevel;
        Product = product;
    }
}
