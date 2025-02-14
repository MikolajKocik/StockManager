﻿namespace StockManager.Application.Dtos
{
    public class ProductDto
    {

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Genre { get; set; } = default!; // enum as string
        public string? Unit { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime DeliveredAt { get; set; }
        public string Type { get; set; } = default!; // enum as string 
        public string BatchNumber { get; set; } = string.Empty;
        public SupplierDto Supplier { get; set; } = default!; 
        public Guid SupplierId { get; set; }

    }
}
