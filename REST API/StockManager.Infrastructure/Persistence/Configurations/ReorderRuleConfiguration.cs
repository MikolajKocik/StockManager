using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.ReorderRuleEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;
internal sealed class ReorderRuleConfiguration : IEntityTypeConfiguration<ReorderRule>
{
    public void Configure(EntityTypeBuilder<ReorderRule> builder)
    {
        builder.HasQueryFilter(rr => rr.Product.IsDeleted == null ||
                rr.Product.IsDeleted == false);

        builder.Property(rr => rr.MinLevel)
            .HasPrecision(18, 2);

        builder.Property(rr => rr.MaxLevel)
            .HasPrecision(18, 2);

        builder.Property(rr => rr.Warehouse)
            .HasConversion<string>();
    }
}
