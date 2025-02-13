using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StockManager.Models;

namespace StockManager.Infrastructure.Configurations
{
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasOne(a => a.Supplier)
                .WithOne(s => s.Address)
                .HasConstraintName("FK_Supplier_Address")
                .HasForeignKey<Address>(a => a.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
