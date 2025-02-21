using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using StockManager.Application.Extensions;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);

//serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Information)
        .WriteTo.Console(outputTemplate: "[{Timestamp:dd-MM HH:mm:ss} |{SourceContext}| {NewLine}{Level:u3}] {Message:lj}{NewLine}{Exception}")
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
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
