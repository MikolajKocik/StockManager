namespace StockManager.Core.Domain.Interfaces.Services;

public interface IBlobStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task<Stream> DownloadAsync(string blobUrl);
    Task DeleteAsync(string blobUrl);
}
