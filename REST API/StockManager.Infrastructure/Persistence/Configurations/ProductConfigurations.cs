using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class ProductConfigurations : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.HasIndex(p => p.Slug).IsUnique();

        builder.HasQueryFilter(p => p.IsDeleted == null || p.IsDeleted == false);

        // shadow properties
        builder.Metadata
            .FindNavigation(nameof(Product.InventoryItems))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Metadata
            .FindNavigation(nameof(Product.PurchaseOrderLines))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Metadata
            .FindNavigation(nameof(Product.SalesOrderLines))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Metadata
            .FindNavigation(nameof(Product.ReturnOrderLines))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Metadata
            .FindNavigation(nameof(Product.ReorderRules))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        // value conversions
        builder.Property(p => p.Genre)
            .HasConversion<string>();

        builder.Property(p => p.Type)
            .HasConversion<string>();

        // relations
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
