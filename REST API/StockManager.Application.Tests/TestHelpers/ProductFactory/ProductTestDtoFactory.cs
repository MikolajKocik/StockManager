using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Tests.TestHelpers.ProductFactory;

public static class ProductTestDtoFactory
{
    public static ProductDto CreateTestDto(
       int id = 1,
       string genre = "Meat",  
       string name = "Test Products", 
       string unit = "kg",
       int quantity = 10,
       string warehouse = "FreezerSection",
       string batch = "BATCH-001"
        )    
    {
        return new ProductDto
        {
            Id = id,
            Name = name,
            Unit = unit,
            BatchNumber = batch,
            Genre = genre,
            Type = warehouse, 
            DeliveredAt = DateTime.UtcNow,
            ExpirationDate = DateTime.UtcNow.AddDays(30),
            Quantity = quantity,
            SupplierId = Guid.NewGuid()
        };
    }
}
