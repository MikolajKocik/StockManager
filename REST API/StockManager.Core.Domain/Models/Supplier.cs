namespace StockManager.Models
{
    public class Supplier
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // relation 1-1 with supplier
        public Address Address { get; set; } = default!;

        // relation 1-* with product
        public List<Product> Products { get; set; } = new List<Product>();
    }
}