using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.Tests.TestHelpers.ProductFactory;

public static class ProductTestFactory
{
    public static Product CreateTestProduct(
        int id = 1,
        string name = "Test Products",
        Genre genre = Genre.Meat,
        string unit = "kg",
        int quantity = 10,
        Warehouse type = Warehouse.FreezerSection,
        string batchNumber = "BATCH-001",
        Guid? supplierId = null,
        DateTime? expiration = null
        )
    {
        return new Product(
            id,
            name,
            genre,
            unit,
            type,
            batchNumber,
            supplierId ?? Guid.NewGuid(),
            expiration ?? DateTime.UtcNow.AddDays(30)
            );
    }
}
