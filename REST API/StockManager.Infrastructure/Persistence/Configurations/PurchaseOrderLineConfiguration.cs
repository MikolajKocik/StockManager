using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;
internal sealed class PurchaseOrderLineConfiguration : IEntityTypeConfiguration<PurchaseOrderLine>
{
    public void Configure(EntityTypeBuilder<PurchaseOrderLine> builder)
    {
        builder.HasQueryFilter(pol => pol.Product.IsDeleted == null ||
                pol.Product.IsDeleted == false);

        builder.Property(pol => pol.Quantity)
            .HasPrecision(18, 2);

        builder.Property(pol => pol.UnitPrice)
           .HasPrecision(18, 2);

        builder.Property(pol => pol.UoM)
            .HasConversion<string>();
    }
}
