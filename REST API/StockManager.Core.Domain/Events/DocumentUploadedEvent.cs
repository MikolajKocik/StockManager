namespace StockManager.Core.Domain.Events;

public record DocumentUploadedEvent(int FileMetadataId, string BlobUrl);