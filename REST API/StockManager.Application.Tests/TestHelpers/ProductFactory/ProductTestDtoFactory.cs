using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Tests.TestHelpers.ProductFactory;

public static class ProductTestDtoFactory
{
    public static ProductCreateDto CreateTestDto(
       string genre = "Meat",  
       string name = "Test Products", 
       string unit = "kg",
       string warehouse = "FreezerSection",
       string batch = "BATCH-001"
        )    
    {
        return new ProductCreateDto
        {
            Name = name,
            Unit = unit,
            BatchNumber = batch,
            Genre = genre,
            Type = warehouse, 
            ExpirationDate = DateTime.UtcNow.AddDays(30),
            SupplierId = Guid.NewGuid()
        };
    }
}
