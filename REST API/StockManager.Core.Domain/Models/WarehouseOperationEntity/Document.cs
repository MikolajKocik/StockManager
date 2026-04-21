using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.WarehouseOperationEntity;

public sealed class Document : Entity<int>
{
    public int OperationId { get; private set; }
    public string DocumentNumber { get; private set; }
    public string FileUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Document(int operationId, string documentNumber, string fileUrl) : base()
    {
        Guard.AgainstDefaultValue(operationId);
        Guard.AgainstNullOrWhiteSpace(documentNumber, fileUrl);

        OperationId = operationId;
        DocumentNumber = documentNumber;
        FileUrl = fileUrl;
        CreatedAt = DateTime.UtcNow;
    }

    private Document() : base() { }
}
