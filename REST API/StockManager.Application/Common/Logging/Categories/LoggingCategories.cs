using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Logging.Categories;

public enum LoggingCategories
{
    [System.ComponentModel.Description("StockManager.Product")]
    Product,
    [System.ComponentModel.Description("StockManager.Supplier")]
    Supplier,
    [System.ComponentModel.Description("StockManager.InventoryItem")]
    InventoryItem,
    [System.ComponentModel.Description("StockManager.General")]
    General,
    [System.ComponentModel.Description("StockManager.RedisCache")]
    RedisCache
}
