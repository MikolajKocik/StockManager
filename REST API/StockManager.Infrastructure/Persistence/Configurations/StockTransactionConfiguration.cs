using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

public class StockTransactionConfiguration : IEntityTypeConfiguration<StockTransaction>
{
    public void Configure(EntityTypeBuilder<StockTransaction> builder)
    {
        builder.Property(x => x.ReferenceNumber)
            .HasMaxLength(100);

        builder.Property(x => x.Date)
            .HasColumnType("date");

        builder.HasIndex(x => new { x.InventoryItemId, x.Type, x.Date, x.ReferenceNumber, x.SourceLocationId, x.TargetLocationId })
            .IsUnique()
            .HasDatabaseName("UX_StockTransaction_BusinessKey");
    }
}
