using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.AddressEntity;

namespace StockManager.Core.Domain.Models.SupplierEntity;

public sealed partial class Supplier
{
    public void ChangeName(string newName)
    {
        Guard.AgainstNullOrWhiteSpace(newName);

        Name = newName;
    }

    public void ChangeAddress(Address newAddress)
    {
        Guard.AgainstNull(newAddress);

        Address = newAddress;
    }
}
