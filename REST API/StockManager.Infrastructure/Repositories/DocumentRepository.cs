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

    public void AddDocument(FileMetadata fileMetadata)
    => _dbContext.FileMetadatas.Add(fileMetadata);

    public IQueryable<FileMetadata> GetAllFiles()
        =>  _dbContext.FileMetadatas;

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
