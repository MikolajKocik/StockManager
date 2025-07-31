using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class ReturnOrderConfiguration : IEntityTypeConfiguration<ReturnOrder>
{
    public void Configure(EntityTypeBuilder<ReturnOrder> builder)
    {
        builder.HasKey(ro => ro.Id);

        builder.HasOne(ro => ro.SalesOrder)
            .WithOne(so => so.ReturnOrder)
            .HasConstraintName("FK_ReturnOrder_SalesOrder")
            .HasForeignKey<SalesOrder>(so => so.ReturnOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ro => ro.PurchaseOrder)
            .WithOne(po => po.ReturnOrder)
            .HasConstraintName("FK_ReturnOrder_PurchaseOrder")
            .HasForeignKey<PurchaseOrder>(po => po.ReturnOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(ro => ro.ReturnOrderLines)
            .WithOne(rol => rol.ReturnOrder)
            .HasConstraintName("FK_ReturnOrder_ReturnOrderLine")
            .HasForeignKey(rol => rol.ReturnOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(ro => ro.Type)
            .HasConversion<string>();

        builder.Property(ro => ro.Status)
            .HasConversion<string>();
    }
}
