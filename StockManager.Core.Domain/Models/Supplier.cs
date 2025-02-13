namespace StockManager.Models
{
    public class Supplier
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Address Adress { get; set; } = new Address();

        // relation 1-* with product
        public List<Product> Products { get; set; } = new List<Product>();
    }
}