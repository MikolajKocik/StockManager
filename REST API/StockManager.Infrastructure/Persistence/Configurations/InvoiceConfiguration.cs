using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;
internal sealed class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Type)
            .HasConversion<string>();

        builder.Property(i => i.Status)
            .HasConversion<string>();

        builder.Property(i => i.TotalAmount)
            .HasPrecision(18, 2);
    }
}
