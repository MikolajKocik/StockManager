using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace StockManager.Infrastructure.Persistence.Data;
public sealed class StockManagerDbContextFactory : IDesignTimeDbContextFactory<StockManagerDbContext>
{
    // EF CLI local
    public StockManagerDbContext CreateDbContext(string[] args)
    {
        string basePath = Directory.GetCurrentDirectory();

        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
            .Build();

        string? connString = configuration.GetConnectionString("DockerConnection")
            ?? throw new ArgumentException("Connection string is empty value");

        var optionsBuilder = new DbContextOptionsBuilder<StockManagerDbContext>();
        optionsBuilder.UseSqlServer(connString);

        return new StockManagerDbContext(optionsBuilder.Options);
    }
}
