using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.AddressEntity;

namespace StockManager.Core.Domain.Models.SupplierEntity;

public sealed partial class Supplier
{
    public void ChangeName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
        {
            throw new ArgumentException("Name cannot be null or empty", nameof(newName));
        }

        Name = newName;
    }

    public void ChangeAddress(Address newAddress)
    {
        ArgumentNullException.ThrowIfNull(newAddress);

        Address = newAddress;
    }
}
