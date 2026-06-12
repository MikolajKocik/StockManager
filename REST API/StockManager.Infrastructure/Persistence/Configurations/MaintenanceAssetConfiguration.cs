using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class MaintenanceAssetConfiguration : IEntityTypeConfiguration<MaintenanceAsset>
{
    public void Configure(EntityTypeBuilder<MaintenanceAsset> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Name).IsRequired().HasMaxLength(150);
        builder.Property(a => a.SerialNumber).IsRequired().HasMaxLength(100);

        builder.Property(a => a.Type).HasConversion<string>();
        builder.Property(a => a.Status).HasConversion<string>();

        builder.HasOne(a => a.BinLocation)
            .WithMany()
            .HasForeignKey(a => a.BinLocationId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
