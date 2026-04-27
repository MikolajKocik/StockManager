using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public sealed class DocumentRepository : IDocumentRepository
{
    private readonly StockManagerDbContext _dbContext;

    public DocumentRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddDocumentAsync(FileMetadata fileMetadata, CancellationToken cancellationToken)
    {
        await _dbContext.FileMetadatas.AddAsync(fileMetadata, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    } 

    public async Task<List<FileMetadata>> GetAllFilesAsync(CancellationToken cancellationToken)
        => await _dbContext.FileMetadatas
            .AsNoTracking() 
            .OrderByDescending(f => f.UploadedAt)
            .Select(f => new FileMetadata(f.FileName, f.BlobUrl, f.OperationId))
            .ToListAsync(cancellationToken);

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
