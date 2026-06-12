using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

internal sealed class MaintenanceIncidentConfiguration : IEntityTypeConfiguration<MaintenanceIncident>
{
    public void Configure(EntityTypeBuilder<MaintenanceIncident> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Title).IsRequired().HasMaxLength(200);
        builder.Property(i => i.Description).IsRequired().HasMaxLength(1000);
        builder.Property(i => i.PhotoUrl).HasMaxLength(2048);
        builder.Property(i => i.ResolutionNotes).HasMaxLength(1000);

        builder.Property(i => i.Priority).HasConversion<string>();
        builder.Property(i => i.Status).HasConversion<string>();

        builder.HasOne(i => i.ReportedBy)
            .WithMany()
            .HasForeignKey(i => i.ReportedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.AssignedTo)
            .WithMany()
            .HasForeignKey(i => i.AssignedToId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Asset)
            .WithMany(a => a.Incidents)
            .HasForeignKey(i => i.AssetId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(i => i.BinLocation)
            .WithMany()
            .HasForeignKey(i => i.BinLocationId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
