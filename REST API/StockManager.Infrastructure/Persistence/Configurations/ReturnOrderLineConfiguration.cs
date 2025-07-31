using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;
internal sealed class ReturnOrderLineConfiguration : IEntityTypeConfiguration<ReturnOrderLine>
{
    public void Configure(EntityTypeBuilder<ReturnOrderLine> builder)
    {
        builder.HasQueryFilter(rol => rol.Product.IsDeleted == null ||
                rol.Product.IsDeleted == false);

        builder.Property(rol => rol.Quantity)
            .HasPrecision(18, 2);

        builder.Property(rol => rol.UoM)
            .HasConversion<string>();
    }
}
