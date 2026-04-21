using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Infrastructure.Persistence.Configurations;

public class WarehouseOperationConfiguration : IEntityTypeConfiguration<WarehouseOperation>
{
    public void Configure(EntityTypeBuilder<WarehouseOperation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Type).IsRequired();
        builder.Property(x => x.Status).IsRequired();
        builder.Property(x => x.Date).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(500);

        builder.HasMany(x => x.Items)
            .WithOne()
            .HasForeignKey(x => x.OperationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class OperationItemConfiguration : IEntityTypeConfiguration<OperationItem>
{
    public void Configure(EntityTypeBuilder<OperationItem> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Quantity).HasPrecision(18, 4);
    }
}

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DocumentNumber).IsRequired().HasMaxLength(50);
        builder.Property(x => x.FileUrl).IsRequired().HasMaxLength(2048);
    }
}

public class FileMetadataConfiguration : IEntityTypeConfiguration<FileMetadata>
{
    public void Configure(EntityTypeBuilder<FileMetadata> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.FileName).IsRequired().HasMaxLength(255);
        builder.Property(x => x.BlobUrl).IsRequired().HasMaxLength(2048);
    }
}
