using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.CustomerEntity;

public sealed class Customer
{
    public int Id { get; private set; }
    public string Name { get; private set; }

    public Guid AddressId { get; private set; }
    public Address Address { get; private set; }

    public string TaxId { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }

    public ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();

    private Customer() { }

    public Customer(string name, Address address, string taxId, string email, string phone)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name required");
        }

        if (!email.Contains('@'))
        {
            throw new ArgumentException("E‑mail bad format");
        }

        Name = name;
        Address = address ?? throw new ArgumentNullException(nameof(address));
        AddressId = address.Id;
        TaxId = taxId;
        Email = email;
        Phone = phone;
    }
}
