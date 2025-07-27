using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrder;

public sealed record PurchaseOrderCreateDto
{
    public Guid SupplierId { get; init; }
    public DateTime OrderDate { get; init; }
    public DateTime? ExpectedDate { get; init; }
    public int? InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
}
