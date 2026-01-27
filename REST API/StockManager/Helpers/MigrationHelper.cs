using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Infrastructure.Persistence.Data;

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

        var sw = Stopwatch.StartNew();

        while (sw.Elapsed < TimeSpan.FromSeconds(60))
        {
            try
            {
                if (await dbContext.Database.CanConnectAsync(cancellationToken))
                {
                    break;
                }
            }
            catch { }

            await Task.Delay(2000, cancellationToken);
        }

        if (!await dbContext.Database.CanConnectAsync(cancellationToken))
        {
            logger.LogWarning("DB not reachable, skipping Dev migrations.");
            return;
        }

        var pending = (await dbContext.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();
        if (pending.Count == 0)
        {
            logger.LogInformation("No pending migrations.");
            return;
        }

        IExecutionStrategy strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            logger.LogInformation("Applying {Count} migration(s)...", pending.Count);
            await dbContext.Database.MigrateAsync(cancellationToken);
            logger.LogInformation("Migrations applied.");
        });
    }
}
