namespace StockManager.Core.Application.Dtos.ModelsDto
{
    public sealed class SupplierDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; } 
        public AddressDto? Address { get; set; } 
        public Guid? AddressId { get; set; }
    }
}

