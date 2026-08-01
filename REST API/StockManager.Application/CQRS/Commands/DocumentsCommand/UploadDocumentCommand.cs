using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Commands.DocumentsCommand;

public sealed record UploadDocumentCommand(
    string FileName,
    string ContentType,
    Stream FileStream,
    int? OperationId
) : ICommand<FileMetadata>;
