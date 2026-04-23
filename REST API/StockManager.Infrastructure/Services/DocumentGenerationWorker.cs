using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Infrastructure.Services;

public class DocumentGenerationWorker : BackgroundService
{
    private readonly ILogger<DocumentGenerationWorker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IMessageBus _messageBus;

    public DocumentGenerationWorker(
        ILogger<DocumentGenerationWorker> logger,
        IServiceScopeFactory scopeFactory,
        IMessageBus messageBus)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _messageBus = messageBus;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await _messageBus.SubscribeAsync<DocumentGenerationRequest>("generate-document", async request =>
                {
                    await GenerateDocument(request.OperationId);
                });

                await Task.Delay(Timeout.Infinite, stoppingToken);
                return;
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogWarning(ex, "RabbitMQ unavailable, retrying in 10s...");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }

    private async Task GenerateDocument(int operationId)
    {
        using var scope = _scopeFactory.CreateScope();
        var operationRepository = scope.ServiceProvider.GetRequiredService<IWarehouseOperationRepository>();
        var productRepository = scope.ServiceProvider.GetRequiredService<IProductRepository>();
        var pdfService = scope.ServiceProvider.GetRequiredService<IPdfService>();
        var blobStorage = scope.ServiceProvider.GetRequiredService<IBlobStorageService>();
        var dbContext = scope.ServiceProvider.GetRequiredService<StockManager.Infrastructure.Persistence.Data.StockManagerDbContext>();

        // Get operation from database
        var operation = await operationRepository.GetByIdAsync(operationId, CancellationToken.None);
        if (operation == null) return;

        var itemsWithNames = new List<(string ProductName, decimal Quantity)>();
        foreach (var item in operation.Items)
        {
            var product = await productRepository.GetProductByIdAsync(item.ProductId, CancellationToken.None);
            itemsWithNames.Add((product?.Name ?? "Unknown", item.Quantity));
        }

        // Generate PDF document
        using var pdfStream = await pdfService.GenerateOperationDocumentAsync(operation, itemsWithNames);
        string fileName = $"{operation.Type}_{operation.Id}_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
        var fileUrl = await blobStorage.UploadAsync(pdfStream, fileName, "application/pdf");

        // Save document to database
        var document = new Document(operationId, $"{operation.Type}/{DateTime.UtcNow:yyyy/MM}/{operation.Id:D3}", fileUrl);
        await dbContext.Documents.AddAsync(document);
        await dbContext.SaveChangesAsync();

        _logger.LogInformation($"Document generated for operation {operationId}: {fileUrl}");
    }
}

public class DocumentGenerationRequest
{
    public int OperationId { get; set; }
}
