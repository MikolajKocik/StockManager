using System;

namespace StockManager.Application.Dtos.ModelsDto.Invoice;

public sealed record InvoiceCreateDto
{
    public string Type { get; init; }
    public DateTime InvoiceDate { get; init; }
    public decimal TotalAmount { get; init; }
    public DateTime? DueDate { get; init; }
    public int? PurchaseOrderId { get; init; }
    public int? SalesOrderId { get; init; }
}

