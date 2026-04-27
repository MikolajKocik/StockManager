using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IDocumentRepository : IBaseRepository
{
    Task AddDocumentAsync(FileMetadata fileMetadata, CancellationToken cancellationToken);

    Task<List<FileMetadata>> GetAllFilesAsync(CancellationToken cancellationToken);
}
