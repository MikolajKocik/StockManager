using Microsoft.EntityFrameworkCore;
using Serilog;
using StockManager.Application.Extensions;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Extensions;
using StockManager.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);

builder.Services.AddScoped<ErrorHandlingMiddleware>();

//serilog
builder.Host.UseSerilog((context, configuration) =>
     configuration.ReadFrom.Configuration(context.Configuration)
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{ 
    app.UseSwagger();
    app.UseSwaggerUI();
}

//serilog requests
app.UseSerilogRequestLogging();

// Automatically checks pending migrations and update database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<StockManagerDbContext>();

    var pendingMigrations = dbContext.Database.GetPendingMigrations();

    if (pendingMigrations.Any())
    {
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
