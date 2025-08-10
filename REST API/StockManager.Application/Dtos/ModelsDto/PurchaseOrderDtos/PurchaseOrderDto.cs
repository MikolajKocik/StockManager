using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

public sealed record PurchaseOrderDto
{
    public int Id { get; init; }
    public Guid SupplierId { get; init; }
    public string? SupplierName { get; init; }
    public DateTime OrderDate { get; init; }
    public DateTime? ExpectedDate { get; init; }
    public required string Status { get; init; }
    public int? InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
}
