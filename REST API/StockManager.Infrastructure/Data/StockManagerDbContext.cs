using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Models;
using StockManager.Models;

namespace StockManager.Infrastructure.Data
{
    public class StockManagerDbContext(DbContextOptions<StockManagerDbContext> options) 
        : IdentityDbContext<User>(options)
    {

        internal DbSet<Product> Products { get; set; }
        internal DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
        }
    }
}
