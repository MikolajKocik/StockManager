namespace StockManager.Core.Domain.Dtos.ModelsDto
{
    public sealed class ProductDto
    {

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty; // enum as string
        public string Unit { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime DeliveredAt { get; set; }
        public string Type { get; set; } = string.Empty; // enum as string 
        public string BatchNumber { get; set; } = string.Empty;
        public SupplierDto? Supplier { get; set; }
        public Guid? SupplierId { get; set; }
    }
}
