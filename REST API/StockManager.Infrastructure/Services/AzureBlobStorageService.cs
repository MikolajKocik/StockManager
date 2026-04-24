using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public sealed class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    private readonly ILogger<AzureBlobStorageService> _logger;
    private static readonly SemaphoreSlim _semaphoreSlim = new(5, 5);

    public AzureBlobStorageService(IConfiguration configuration, ILogger<AzureBlobStorageService> logger)
    {
        _logger = logger;
        
        string connectionString = configuration["AzureStorage:ConnectionString"] 
            ?? throw new ArgumentException("AzureStorage connection string is missing");
        _containerName = configuration["AzureStorage:ContainerName"] ?? "documents";
        
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    private BlobClient GetBlobClientFromUrl(string blobUrl)
    {   
        if (!Uri.TryCreate(blobUrl, UriKind.Absolute, out Uri uri))
        {
            throw new ArgumentException("Invalid blob url", nameof(blobUrl));
        }
        
        var blobUriBuilder = new BlobUriBuilder(uri);
        
        BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        return containerClient.GetBlobClient(blobUriBuilder.BlobName);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken)
    {
        await _semaphoreSlim.WaitAsync(cancellationToken);
        try
        {
            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            BlobClient blobClient = containerClient.GetBlobClient(fileName);

            try
            {
                await blobClient.UploadAsync(
                    fileStream, 
                    new BlobHttpHeaders { ContentType = contentType }, 
                    cancellationToken: cancellationToken
                );
            }
            catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.ContainerNotFound)
            {
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);
                
                if (fileStream.CanSeek)
                {             
                    fileStream.Position = 0; 
                }

                await blobClient.UploadAsync(
                    fileStream, 
                    new BlobHttpHeaders { ContentType = contentType }, 
                    cancellationToken: cancellationToken
                );
            }

            return blobClient.Uri.ToString();
        }
        catch (Exception ex)
        {
            GeneralLogError.InvalidOperationException(_logger, ex.Message, ex);
            throw;
        }
        finally
        {
            _semaphoreSlim.Release();
        }
    }

    public async Task<Stream> DownloadAsync(string blobUrl, CancellationToken cancellationToken)
    {
        try
        {
            BlobClient blobClient = GetBlobClientFromUrl(blobUrl);
            Azure.Response<BlobDownloadInfo> downloadInfo = await blobClient.DownloadAsync(cancellationToken);

            return downloadInfo.Value.Content;     
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }  
    }

    public async Task DeleteAsync(string blobUrl, CancellationToken cancellationToken)
    {
        try
        {   
            BlobClient blobClient = GetBlobClientFromUrl(blobUrl);
            await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
