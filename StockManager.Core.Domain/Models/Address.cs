namespace StockManager.Models
{
    public class Address
    {
        public string City { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string PostalCode { get; set; } = string.Empty;

        // relation 1-1 with supplier
        public Guid SupplierId { get; set; }
        public Supplier Supplier { get; set; } = new Supplier();
    }
}