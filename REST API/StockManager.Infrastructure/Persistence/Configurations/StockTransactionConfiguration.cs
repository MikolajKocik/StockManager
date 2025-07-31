using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

public class StockTransactionConfiguration : IEntityTypeConfiguration<StockTransaction>
{
    public void Configure(EntityTypeBuilder<StockTransaction> builder)
    {
        builder.Property(st => st.ReferenceNumber)
            .HasMaxLength(100);

        builder.Property(st => st.Date)
            .HasColumnType("date");

        builder.HasQueryFilter(ii => ii.InventoryItem.Product.IsDeleted == null ||
             ii.InventoryItem.Product.IsDeleted == false);

        // to check in handler that the same properties already exists, if yes -> http 409 conflict
        // because create dto for stock transaction does not have id to check 
        builder.HasIndex(st => new { st.InventoryItemId, st.Type, st.Date, st.ReferenceNumber, st.SourceLocationId, st.TargetLocationId })
            .IsUnique()
            .HasDatabaseName("UX_StockTransaction_BusinessKey");

        builder.Property(st => st.Type)
            .HasConversion<string>();

        builder.Property(st => st.Quantity)
            .HasPrecision(18, 2);
    }
}
