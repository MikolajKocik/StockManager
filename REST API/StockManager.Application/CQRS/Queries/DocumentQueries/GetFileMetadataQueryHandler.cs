using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed class GetFileMetadataQueryHandler : IQueryHandler<GetFileMetadataQuery, IReadOnlyList<FileMetadata>>
{
    private readonly IDocumentRepository _docRepository;

    public GetFileMetadataQueryHandler(IDocumentRepository docRepository)
    {
        _docRepository = docRepository;
    }

    public async Task<Result<IReadOnlyList<FileMetadata>>> Handle(GetFileMetadataQuery query, CancellationToken cancellationToken)
    {
        List<FileMetadata> files  = await _docRepository
            .GetAllFiles()
            .AsNoTracking()
            .OrderByDescending(f => f.UploadedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return Result<IReadOnlyList<FileMetadata>>.Success(files);
    }
}
