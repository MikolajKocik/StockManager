using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Models;

namespace StockManager.Infrastructure.Configurations
{
    internal sealed class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasOne(a => a.Supplier)
                .WithOne(s => s.Address)
                .HasConstraintName("FK_Address_Supplier")
                .HasForeignKey<Address>(a => a.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
