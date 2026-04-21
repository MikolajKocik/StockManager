using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IPdfService
{
    Task<Stream> GenerateOperationDocumentAsync(WarehouseOperation operation, List<(string ProductName, decimal Quantity)> items);
}
