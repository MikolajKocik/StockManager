using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.WarehouseOperationEntity;

public sealed class FileMetadata : Entity<int>
{
    public string FileName { get; private set; }
    public string BlobUrl { get; private set; }
    public DateTime UploadedAt { get; private set; }
    public int? OperationId { get; private set; }

    public FileMetadata(string fileName, string blobUrl, int? operationId = null) : base()
    {
        Guard.AgainstNullOrWhiteSpace(fileName, blobUrl);

        FileName = fileName;
        BlobUrl = blobUrl;
        OperationId = operationId;
        UploadedAt = DateTime.UtcNow;
    }

    private FileMetadata() : base() { }
}
