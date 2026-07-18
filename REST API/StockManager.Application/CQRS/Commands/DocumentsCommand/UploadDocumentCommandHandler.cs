using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Events;

namespace StockManager.Application.CQRS.Commands.DocumentsCommand;

public sealed class UploadDocumentCommandHandler(
        IBlobStorageService blobService,
        IDocumentRepository docRepository,
        IUnitOfWork uow,
        IMessageBus messageBus
    ) : ICommandHandler<UploadDocumentCommand, FileMetadata>
{
    private readonly IBlobStorageService _blobService = blobService;
    private readonly IDocumentRepository _docRepository = docRepository;
    private readonly IUnitOfWork _uow = uow;
    private readonly IMessageBus _messageBus = messageBus;

    public async Task<Result<FileMetadata>> Handle(UploadDocumentCommand command, CancellationToken ct)
    {
        string blobUrl = await _blobService.UploadAsync(
            command.FileStream,
            command.FileName,
            command.ContentType,
            ct
        );

        var fileMetadata = new FileMetadata(
            command.FileName,
            blobUrl,
            command.OperationId
        );

        _docRepository.AddDocument(fileMetadata);
        await _uow.SaveChangesAsync(ct);

        bool isPdf = command.ContentType == "application/pdf"
            || command.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);

        if (isPdf)
        {
            await _messageBus.PublishAsync(
                new DocumentUploadedEvent(fileMetadata.Id, blobUrl),
                "document-ingestion",
                ct);
        }

        return Result<FileMetadata>.Success(fileMetadata);
    }
}
