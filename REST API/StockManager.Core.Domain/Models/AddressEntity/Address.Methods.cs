using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.AddressEntity;

public sealed partial class Address
{
    public void ChangeAddressDetails(
        string city,
        string country,
        string postalCode)
    {
        Guard.AgainstNullOrWhiteSpace(city, country, postalCode);

        City = city;
        Country = country;
        PostalCode = postalCode;
    }

    public void AssignToSupplier(Guid supplierId)
    {
        Guard.AgainstDefaultValue(supplierId);

        SupplierId = supplierId;
    }
}
