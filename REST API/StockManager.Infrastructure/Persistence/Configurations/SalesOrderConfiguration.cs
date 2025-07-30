using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class SalesOrderConfiguration : IEntityTypeConfiguration<SalesOrder>
{
    public void Configure(EntityTypeBuilder<SalesOrder> builder)
    {
        builder.HasKey(so => so.Id);

        builder.HasOne(so => so.Customer)
            .WithMany(c => c.SalesOrders)
            .HasConstraintName("FK_SalesOrder_Customer")
            .HasForeignKey(so => so.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(so => so.SalesOrderLines)
            .WithOne(sol => sol.SalesOrder)
            .HasConstraintName("FK_SalesOrder_SalesOrderLine")
            .HasForeignKey(sol => sol.SalesOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(so => so.Shipments)
            .WithOne(s => s.SalesOrder)
            .HasConstraintName("FK_SalesOrder_Shipment")
            .HasForeignKey(s => s.SalesOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(so => so.Invoice)
            .WithOne(i => i.SalesOrder)
            .HasConstraintName("FK_SalesOrder_Invoice")
            .HasForeignKey<Invoice>(i => i.SalesOrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
