using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Infrastructure.Configurations;

internal sealed class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.HasKey(ii => ii.Id);

        builder.HasOne(ii => ii.BinLocation)
            .WithMany(bl => bl.InventoryItems)
            .HasConstraintName("FK_InvetoryItem_BinLocation")
            .HasForeignKey(bl => bl.BinLocationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(ii => ii.StockTransactions)
            .WithOne(st => st.InventoryItem)
            .HasConstraintName("FK_InventoryItem_StockTransaction")
            .HasForeignKey(st => st.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
