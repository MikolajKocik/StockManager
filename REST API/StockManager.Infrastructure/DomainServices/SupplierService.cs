using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class SupplierService : ISupplierService
{
    public void ChangeName(Supplier supplier, string newName)
        => supplier.ChangeName(newName);

    public void ChangeAddress(Supplier supplier, Address newAddress)
        => supplier.ChangeAddress(newAddress);
}
