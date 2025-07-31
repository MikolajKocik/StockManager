using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;
internal sealed class SalesOrderLineConfiguration : IEntityTypeConfiguration<SalesOrderLine>
{
    public void Configure(EntityTypeBuilder<SalesOrderLine> builder)
    {
        builder.HasQueryFilter(sol => sol.Product.IsDeleted == null ||
                sol.Product.IsDeleted == false);

        builder.Property(sol => sol.Quantity)
            .HasPrecision(18, 2);

        builder.Property(sol => sol.UnitPrice)
            .HasPrecision(18, 2);

        builder.Property(sol => sol.UoM)
            .HasConversion<string>();
    }
}
