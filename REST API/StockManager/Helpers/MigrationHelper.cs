using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Infrastructure.Persistence.Data;
using StockManager.Core.Domain.Models;

namespace StockManager.Helpers;

internal static class MigrationHelper
{
    public static async Task AddAutomateMigrations(
        this WebApplication app, 
        CancellationToken cancellationToken)
    {
        if (!app.Environment.IsDevelopment())
        {
            return;
        }

        await using AsyncServiceScope scope = app.Services.CreateAsyncScope();

        ILogger logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger(nameof(MigrationHelper));

        StockManagerDbContext dbContext = scope.ServiceProvider
            .GetRequiredService<StockManagerDbContext>();

        logger.LogInformation("Starting Dev migrations and seeding...");

        try
        {
            var pending = (await dbContext.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();
            if (pending.Any())
            {
                logger.LogInformation("Applying {Count} migration(s)...", pending.Count);
                await dbContext.Database.MigrateAsync(cancellationToken);
                logger.LogInformation("Migrations applied.");
            }
            else
            {
                logger.LogInformation("No pending migrations.");
            }

            await SeedAdminUserAsync(dbContext, logger, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to apply migrations or seed data.");
        }
    }

    private static async Task SeedAdminUserAsync(
        StockManagerDbContext dbContext,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var adminUser = await dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "admin", cancellationToken);
        if (adminUser == null)
        {
            logger.LogInformation("Seeding admin user...");
            adminUser = new StockManager.Core.Domain.Models.UserEntity.User("admin", "admin");
            adminUser.NormalizedUserName = "ADMIN";
            adminUser.SecurityStamp = Guid.NewGuid().ToString();
            dbContext.Users.Add(adminUser);
            await dbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Admin user seeded successfully.");
        }
        else if (string.IsNullOrEmpty(adminUser.NormalizedUserName))
        {
            logger.LogInformation("Updating existing admin user with normalization...");
            adminUser.NormalizedUserName = "ADMIN";
            adminUser.SecurityStamp ??= Guid.NewGuid().ToString();
            await dbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Admin user updated successfully.");
        }
    }
}
