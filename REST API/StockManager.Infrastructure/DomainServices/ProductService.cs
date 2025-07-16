using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class ProductService : IProductService
{
    public void SetSupplier(Product product, Supplier newSupplier)
        => product.SetSupplier(newSupplier);
}
