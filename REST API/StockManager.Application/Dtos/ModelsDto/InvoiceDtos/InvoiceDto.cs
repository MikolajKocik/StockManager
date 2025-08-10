using System;

namespace StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

public sealed record InvoiceDto
{
    public int Id { get; init; }
    public required string Type { get; init; }
    public DateTime InvoiceDate { get; init; }
    public DateTime? DueDate { get; init; }
    public required string Status { get; init; }
    public decimal TotalAmount { get; init; }
    public int? PurchaseOrderId { get; init; }
    public int? SalesOrderId { get; init; }
}

