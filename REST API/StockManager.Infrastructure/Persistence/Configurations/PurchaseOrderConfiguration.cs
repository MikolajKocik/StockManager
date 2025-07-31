using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.HasKey(po => po.Id);

        builder.HasOne(po => po.Supplier)
            .WithMany(s => s.PurchaseOrders)
            .HasConstraintName("FK_PurchaseOrder_Supplier")
            .HasForeignKey(po => po.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(po => po.PurchaseOrderLines)
            .WithOne(pol => pol.PurchaseOrder)
            .HasConstraintName("FK_PurchaseOrder_PurchaseOrderLine")
            .HasForeignKey(pol => pol.PurchaseOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(po => po.Invoice)
            .WithOne(i => i.PurchaseOrder)
            .HasConstraintName("FK_PurchaseOrder_Invoice")
            .HasForeignKey<Invoice>(i => i.PurchaseOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(po => po.Status)
            .HasConversion<string>();
    }
}
