using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.AddressEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IAddressService
{
    void ChangeAddressDetails(
        Address address,
        string city,
        string country,
        string postalCode);
    void AssignToSupplier(Address address, Guid supplierId);
}
