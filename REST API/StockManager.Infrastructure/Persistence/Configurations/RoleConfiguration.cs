using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.PermissionEntity;
using StockManager.Core.Domain.Models.RoleEntity;
using StockManager.Core.Domain.SharedModels.RolePermissionsEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.Id);

        builder.HasMany(r => r.Permissions)
            .WithMany(p => p.Roles)
            .UsingEntity<RolePermissions>(
            r => r.HasOne<Permission>()
                .WithMany()
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Restrict),
            p => p.HasOne<Role>()
                .WithMany()
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Restrict)
            );
    }
}
