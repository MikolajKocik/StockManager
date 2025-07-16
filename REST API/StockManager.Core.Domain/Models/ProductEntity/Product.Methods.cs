using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Models.ProductEntity;

public sealed partial class Product
{
    public void SetSupplier(Supplier newSupplier)
    {
        Supplier = newSupplier ?? throw new ArgumentNullException(nameof(newSupplier));
    }
}
