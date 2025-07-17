using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Infrastructure.Configurations;

internal sealed class InventoryItemConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Slug).IsUnique();

        builder.HasKey(u => u.Id);

        builder.HasMany(u => u.AuditLogs)
            .WithOne(al => al.ChangedBy)
            .HasConstraintName("FK_ChangedBy_User_AuditLog")
            .HasForeignKey(al => al.ChangedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
