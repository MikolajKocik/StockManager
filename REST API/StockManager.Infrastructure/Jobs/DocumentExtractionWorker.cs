using StockManager.Core.Domain.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using StockManager.Core.Domain.Events;
using StockManager.Infrastructure.Ollama.Interfaces;
namespace StockManager.Infrastructure.Jobs;

public sealed class DocumentExtractionWorker(
        ILogger<DocumentExtractionWorker> logger,
        IMessageBus messageBus,
        IDocumentIngestionService ingestionService,
        IPdfService pdfService,
        IBlobStorageService blobService
    ) : BackgroundService
{
    private readonly ILogger<DocumentExtractionWorker> _logger = logger;    
    private readonly IMessageBus _messageBus = messageBus;    
    private readonly IDocumentIngestionService _ingestionService = ingestionService;
    private readonly IPdfService _pdfService = pdfService;
    private readonly IBlobStorageService _blobService = blobService;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _messageBus.SubscribeAsync<DocumentUploadedEvent>("document-ingestion", async @event =>
        {
            await using Stream stream = await _blobService.DownloadAsync(@event.BlobUrl, stoppingToken);

            _logger.LogInformation("Extracting raw text from pdf file");
            string extractedText = _pdfService.ExtractTextFromPdf(stream);

            if (!string.IsNullOrWhiteSpace(extractedText))
            {
                _logger.LogInformation("Processing document to extract");
                await _ingestionService.ProcessDocumentAsync(@event.FileMetadataId, extractedText, stoppingToken);
            }
        }, stoppingToken);      

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}