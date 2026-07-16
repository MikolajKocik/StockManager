using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IDocumentRepository : IBaseRepository
{
    void AddDocument(FileMetadata fileMetadata);

    IQueryable<FileMetadata> GetAllFiles();
}
