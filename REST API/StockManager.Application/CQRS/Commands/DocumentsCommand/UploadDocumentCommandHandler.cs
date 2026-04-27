using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.DocumentsCommand;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Ollama.Interfaces;

namespace StockManager.Application.CQRS.Commands.DocumentsCommand;

public sealed class UploadDocumentCommandHandler : ICommandHandler<UploadDocumentCommand, FileMetadata>
{
    private readonly IBlobStorageService _blobService;
    private readonly IDocumentRepository _docRepository;
    private readonly IPdfService _pdfService;
    private readonly IDocumentIngestionService _ingestionService;

    public UploadDocumentCommandHandler(
        IBlobStorageService blobService,
        IDocumentRepository docRepository,
        IPdfService pdfService,
        IDocumentIngestionService ingestionService
    )
    {
        _blobService = blobService;
        _docRepository = docRepository;
        _pdfService = pdfService;
        _ingestionService = ingestionService;
    }

    public async Task<Result<FileMetadata>> Handle(UploadDocumentCommand command, CancellationToken cancellationToken)
    {
        // upload to Azure Blob Storage
        string blobUrl = await _blobService.UploadAsync(
            command.FileStream,
            command.FileName,
            command.ContentType,
            cancellationToken
        );

        // save to mssql db context
        var fileMetadata = new FileMetadata(
            command.FileName,
            blobUrl, 
            command.OperationId
        );
        await _docRepository.AddDocumentAsync(fileMetadata, cancellationToken);
        
        // pdf extraction for raw text
        if (command.ContentType == "application/pdf" || command.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            if (command.FileStream.CanSeek)
            {
                command.FileStream.Position = 0;
            }

            string extractedText = _pdfService.ExtractTextFromPdf(command.FileStream);
            if (!string.IsNullOrWhiteSpace(extractedText))
            {
                // send rawText to postgres (Ollama RAG)
                await _ingestionService.ProcessDocumentAsync(fileMetadata.Id, extractedText, cancellationToken);
            }
        }

        return Result<FileMetadata>.Success(fileMetadata);
    }
}
