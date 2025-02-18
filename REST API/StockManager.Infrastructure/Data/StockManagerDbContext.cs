using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StockManager.Models;

namespace StockManager.Infrastructure.Data
{
    public class StockManagerDbContext : IdentityDbContext<IdentityUser>
    {
        public StockManagerDbContext(DbContextOptions<StockManagerDbContext> options) : base(options)
        {
           Database.EnsureCreated();
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
        }
    }
}
