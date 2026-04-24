using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Jobs;

public sealed class DocumentGenerationWorker : BackgroundService
{
    private readonly ILogger<DocumentGenerationWorker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IMessageBus _messageBus;
    private readonly static SemaphoreSlim _semaphore = new(5, 5);

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
                    try
                    {
                        await GenerateDocument(request.OperationId, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        GeneralLogError.UnhandledException(_logger, ex.Message, ex);
                    }
                }, stoppingToken);

                _logger.LogInformation("Rabbitmq subscribed successful");
                break;
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogWarning(ex, "RabbitMQ unavailable, retrying in 10s...");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }

        if (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (TaskCanceledException ex)
            {
                GeneralLogWarning.LogBussinessFailure(
                    _logger,
                    "[Generate Document] Worker is stopping",
                    ex.Message, nameof(TaskCanceledException),
                    ex
                );
            }
        }
    }

    private async Task GenerateDocument(int operationId, CancellationToken cancellationToken)
    {
        await _semaphore.WaitAsync(cancellationToken);
        try
        {
            using IServiceScope scope = _scopeFactory.CreateScope();
            IWarehouseOperationRepository operationRepository = scope.ServiceProvider.GetRequiredService<IWarehouseOperationRepository>();
            IProductRepository productRepository = scope.ServiceProvider.GetRequiredService<IProductRepository>();
            IPdfService pdfService = scope.ServiceProvider.GetRequiredService<IPdfService>();
            IBlobStorageService blobStorage = scope.ServiceProvider.GetRequiredService<IBlobStorageService>();
            StockManagerDbContext dbContext = scope.ServiceProvider.GetRequiredService<StockManagerDbContext>();

            // Get operation from database
            WarehouseOperation operation = await operationRepository.GetByIdAsync(operationId, CancellationToken.None);
            if (operation is null)
            {
                return;
            } 

            var productIds = operation.Items.Select(i => i.ProductId).Distinct().ToList();
            Dictionary<int, string> products = await productRepository.GetProducts()
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, p => p.Name, cancellationToken);

            var itemsWithNames = operation.Items
                .Select(item => (products.GetValueOrDefault(item.ProductId) ?? "Unknown", item.Quantity))
                .ToList();

            // Generate PDF document
            using Stream pdfStream = await pdfService.GenerateOperationDocumentAsync(operation, itemsWithNames, cancellationToken);
            string fileName = $"{operation.Type}_{operation.Id}_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
            string fileUrl = await blobStorage.UploadAsync(pdfStream, fileName, "application/pdf", cancellationToken);
    
            // Save document to database
            var document = new Document(operationId, $"{operation.Type}/{DateTime.UtcNow:yyyy/MM}/{operation.Id:D3}", fileUrl);
            await dbContext.Documents.AddAsync(document, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Document generated for operation {OperationId}: {FileUrl}", operationId, fileUrl);
        }
        finally
        {
            _semaphore.Release();
        }
    }
}

public record DocumentGenerationRequest(int OperationId);
