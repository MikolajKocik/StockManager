using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IDocumentRepository : IBaseRepository
{
    IQueryable<FileMetadata> GetAllFiles();
    void AddDocument(FileMetadata fileMetadata);
}
