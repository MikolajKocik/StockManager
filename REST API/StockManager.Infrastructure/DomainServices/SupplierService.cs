using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Models;

namespace StockManager.Infrastructure.DomainServices;

public sealed class SupplierService : ISupplierService
{
    public void ChangeName(Supplier supplier, string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
        {
            throw new ArgumentException("Name cannot be null or empty", nameof(newName));
        }

        supplier.Name = newName;
    }

    public void ChangeAddress(Supplier supplier, Address newAddress)
    {
        ArgumentNullException.ThrowIfNull(newAddress);

        supplier.Address = newAddress;
    }
}
