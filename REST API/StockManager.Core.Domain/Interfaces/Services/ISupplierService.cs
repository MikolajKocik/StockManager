using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface ISupplierService
{
    void ChangeName(Supplier supplier, string newName);
    void ChangeAddress(Supplier supplier, Address newAddress);
}
