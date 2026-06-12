using System;
using System.Collections.Generic;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

public sealed record PurchaseOrderDto
{
    public int Id { get; init; }
    public Guid SupplierId { get; init; }
    public string? SupplierName { get; init; }
    public string? SupplierTaxId { get; init; }
    public DateTime OrderDate { get; init; }
    public DateTime? ExpectedDate { get; init; }
    public required string Status { get; init; }
    public int? InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
    public List<PurchaseOrderLineDto> PurchaseOrderLines { get; init; } = new();
}
