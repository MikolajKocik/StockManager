using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrder;

public sealed record PurchaseOrderDto
{
    public int Id { get; }
    public Guid SupplierId { get; }
    public string? SupplierName { get; }
    public DateTime OrderDate { get; }
    public DateTime? ExpectedDate { get; }
    public string Status { get; }
    public int? InvoiceId { get; }
    public int? ReturnOrderId { get; }
}
