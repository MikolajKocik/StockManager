using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Infrastructure.Configurations;

internal sealed class ProductConfigurations : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.HasIndex(p => p.Slug).IsUnique();

        builder.HasOne(p => p.Supplier)
            .WithMany(s => s.Products)
            .HasConstraintName("FK_Product_Supplier")
            .HasForeignKey(p => p.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.InventoryItems)
            .WithOne(i => i.Product)
            .HasConstraintName("FK_Product_InventoryItem")
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.PurchaseOrderLines)
            .WithOne(pol => pol.Product)
            .HasConstraintName("FK_Product_PurchaseOrderLine")
            .HasForeignKey(pol => pol.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.SalesOrderLines)
            .WithOne(sol => sol.Product)
            .HasConstraintName("FK_Product_SalesOrderLine")
            .HasForeignKey(sol => sol.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.ReturnOrderLines)
            .WithOne(rol => rol.Product)
            .HasConstraintName("FK_Product_ReturnOrderLine")
            .HasForeignKey(rol => rol.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.ReorderRules)
            .WithOne(rr => rr.Product)
            .HasConstraintName("FK_Product_ReorderRules")
            .HasForeignKey(rr => rr.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
