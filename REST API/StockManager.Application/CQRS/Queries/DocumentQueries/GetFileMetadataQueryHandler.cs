using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed class GetFileMetadataQueryHandler : IQueryHandler<GetFileMetadataQuery, List<FileMetadata>>
{
    private readonly IDocumentRepository _docRepository;

    public GetFileMetadataQueryHandler(IDocumentRepository docRepository)
    {
        _docRepository = docRepository;
    }

    public async Task<Result<List<FileMetadata>>> Handle(GetFileMetadataQuery query, CancellationToken cancellationToken)
    {
        List<FileMetadata> files  = await _docRepository.GetAllFilesAsync(cancellationToken);
    
        return files.Any() 
            ? Result<List<FileMetadata>>.Success(files)
            : Result<List<FileMetadata>>.Success([]);
    }
}
