using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.CustomerEntity;

public sealed class Customer : Entity<int>
{
    public string Name { get; private set; }
    public string TaxId { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }

    // relation 1-* with salesOrder
    private readonly List<SalesOrder> _salesOrders = new();
    public IReadOnlyCollection<SalesOrder> SalesOrders
        => _salesOrders.AsReadOnly();

    // relation 1-1 with address
    public Guid AddressId { get; private set; }
    public Address Address { get; private set; }

    private Customer() : base() { }

    public Customer(
        string name,
        string taxId, 
        string email,
        string phone,
        Guid addressId
        ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(name, taxId, email, phone);
        Guard.AgainstDefaultValue(addressId);

        IsValidEmail(email);

        Name = name;
        AddressId = addressId;
        TaxId = taxId;
        Email = email;
        Phone = phone;
    }

    public Customer(
        int id, 
        string name,
        string taxId,
        string email,
        string phone,
        Guid addressId
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(name, taxId, email, phone);
        Guard.AgainstDefaultValue(addressId);

        IsValidEmail(email);

        Name = name;
        AddressId = addressId;
        TaxId = taxId;
        Email = email;
        Phone = phone;
    }

    private static void IsValidEmail(string email)
    {
        if (!email.Contains('@', StringComparison.Ordinal) || !email.Contains('.', StringComparison.Ordinal))
        {
            throw new ArgumentException("E‑mail bad format");
        }
    }
}
