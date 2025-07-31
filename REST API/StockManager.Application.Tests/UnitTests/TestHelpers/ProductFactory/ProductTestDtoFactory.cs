using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Tests.UnitTests.TestHelpers.ProductFactory;

/// <summary>
/// Provides factory methods for creating test instances of <see cref="ProductCreateDto"/>.
/// </summary>
/// <remarks>This class is intended for use in testing scenarios where pre-configured instances of  <see
/// cref="ProductCreateDto"/> are required. The default parameter values can be overridden  to customize the generated
/// test data.</remarks>
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
            ExpirationDate = DateTime.UtcNow.AddMinutes(-1),
            SupplierId = Guid.NewGuid()
        };
    }
}
