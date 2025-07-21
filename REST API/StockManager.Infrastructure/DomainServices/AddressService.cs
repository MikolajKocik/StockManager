using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.AddressEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class AddressService : IAddressService
{
    public void AssignToSupplier(Address address, Guid supplierId)
        => address.AssignToSupplier(supplierId);

    public void ChangeAddressDetails(Address address, string city, string country, string postalCode)
        => address.ChangeAddressDetails(city, country, postalCode);
}
