using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IDocumentRepository 
{
    IQueryable<FileMetadata> GetAllFiles();
    void AddDocument(FileMetadata fileMetadata);
}
