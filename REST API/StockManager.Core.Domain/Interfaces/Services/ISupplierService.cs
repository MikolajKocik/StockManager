using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface ISupplierService
{
    void ChangeName(Supplier supplier, string newName);
    void ChangeAddress(Supplier supplier, Address newAddress);
}
