using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;

    public AzureBlobStorageService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureStorage:ConnectionString"];
        _containerName = configuration["AzureStorage:ContainerName"] ?? "documents";
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });

        return blobClient.Uri.ToString();
    }

    public async Task<Stream> DownloadAsync(string blobUrl)
    {
        var blobClient = new BlobClient(new Uri(blobUrl));
        var downloadInfo = await blobClient.DownloadAsync();
        return downloadInfo.Value.Content;
    }

    public async Task DeleteAsync(string blobUrl)
    {
        var blobClient = new BlobClient(new Uri(blobUrl));
        await blobClient.DeleteIfExistsAsync();
    }
}
