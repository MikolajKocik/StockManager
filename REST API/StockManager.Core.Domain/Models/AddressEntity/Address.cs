using Microsoft.EntityFrameworkCore.Diagnostics;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using UUIDNext;

namespace StockManager.Core.Domain.Models.AddressEntity;

public sealed partial class Address : Entity<Guid>
{
    public string Slug { get; private set; }
    public string City { get; private set; }
    public string Country { get; private set; } 
    public string PostalCode { get; private set; }

    // relation 1-1 with supplier
    public Guid SupplierId { get; private set; }
    public Supplier Supplier { get; private set; }

    // relation 1-1 with customer
    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; }

    private Address() : base(){ }

    public Address(
        string city,
        string country,
        string postalCode,
        Guid supplierId,
        int customerId
        ) : base(Guid.NewGuid())
    {
        Guard.AgainstNullOrWhiteSpace(city, country, postalCode);
        Guard.AgainstDefaultValue(supplierId);
        Guard.AgainstDefaultValue(customerId);

        Slug = $"add_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        City = city;
        Country = country;
        PostalCode = postalCode;
        SupplierId = supplierId;
        CustomerId = customerId;
    }

    // Constructor for loading existing entities from the database 

    public Address(
        Guid id,
        string city,
        string country,
        string postalCode,
        Guid supplierId,
        int customerId
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(city, country, postalCode);
        Guard.AgainstDefaultValue(supplierId);
        Guard.AgainstDefaultValue(customerId);

        Slug = $"add_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        City = city;
        Country = country;
        PostalCode = postalCode;
        SupplierId = supplierId;
        CustomerId = customerId;
    }
}
