using Microsoft.EntityFrameworkCore.Diagnostics;
using UUIDNext;

namespace StockManager.Models
{
    public sealed class Address
    {
        public Guid Id { get; private set; }
        public string Slug { get; private set; }
        public string City { get; private set; } 
        public string Country { get; private set; } 
        public string PostalCode { get; private set; }

        // relation 1-1 with supplier
        public Guid SupplierId { get; private set; }
        public Supplier Supplier { get; private set; } 

        private Address() { Supplier = default!; }

        public Address(
            Guid id,
            string slug,
            string city,
            string country,
            string postalCode,
            Guid supplierId)
        {
            Id = id;
            Slug = $"add_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
            City = city;
            Country = country;
            PostalCode = postalCode;
            SupplierId = supplierId;
        }
    }
}