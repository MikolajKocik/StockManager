namespace StockManager.Models
{
    public class Product
    {
        public int Id { get; set; } 
        public string Name { get; set; } = string.Empty;
        public Genre Genre { get; set; }
        public string Unit { get; set; } = string.Empty;
        public int Quantity {  get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime DeliveredAt { get; set; }
        public Warehouse Type { get; set; }
        public string BatchNumber { get; set; } = string.Empty;

        // relation 1-* with supplier
        public Supplier Supplier { get; set; } = new Supplier();
        public Guid SupplierId { get; set; }

    }
}
