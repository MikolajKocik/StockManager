using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Helpers;

internal static class MigrationHelper
{
    public static async Task AddAutomateMigrations(this WebApplication app)
    {
        // Automatically checks pending migrations and update database
        using IServiceScope scope = app.Services.CreateScope();

        StockManagerDbContext dbContext = scope.ServiceProvider
            .GetRequiredService<StockManagerDbContext>();

        int retryCount = 0;
        int maxRetries = 10;
        var delay = TimeSpan.FromSeconds(5);

        while (retryCount < maxRetries)
        {
            try
            {

                IEnumerable<string> pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();

                if (pendingMigrations.Any())
                {
                    await dbContext.Database.MigrateAsync();
                }

                break;
            }
            catch (SqlException ex)
            {
                if (ex.Number == 1801)
                {
                    break;
                }

                retryCount++;
                Console.WriteLine($"SQL Server not ready (attempt {retryCount}): {ex.Message}");

                await Task.Delay(delay);
            }
        }
    }
}
