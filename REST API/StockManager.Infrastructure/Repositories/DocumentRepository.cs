using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class DocumentRepository(StockManagerDbContext db) 
    : BaseOperations<FileMetadata>(db), IDocumentRepository
{
    public IQueryable<FileMetadata> GetAllFiles() 
        => GetAll()
            .AsNoTracking();
    
    public void AddDocument(FileMetadata fileMetadata) => Add(fileMetadata);
}
