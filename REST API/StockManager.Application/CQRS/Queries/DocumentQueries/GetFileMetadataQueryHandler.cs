using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed class GetFileMetadataQueryHandler(
    IDocumentRepository docRepository, ILogger<GetFileMetadataQueryHandler> logger)
    : IQueryHandler<GetFileMetadataQuery, IReadOnlyList<FileMetadata>>
{
    private readonly IDocumentRepository _docRepository = docRepository;
    private readonly ILogger<GetFileMetadataQueryHandler> _logger = logger;

    public async Task<Result<IReadOnlyList<FileMetadata>>> Handle(GetFileMetadataQuery query, CancellationToken cancellationToken)
    {
        List<FileMetadata> files = await _docRepository
            .GetAllFiles()
            .AsNoTracking()
            .OrderByDescending(f => f.UploadedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);
        
        GeneralLogInfo.Information(
            _logger,
            $"Retrieved {files.Count} file metadata records for page {query.Page} with page size {query.PageSize}.",
            default
        );

        return Result<IReadOnlyList<FileMetadata>>.Success(files);
    }
}
