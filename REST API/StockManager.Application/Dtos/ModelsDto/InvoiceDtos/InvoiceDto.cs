using System;

namespace StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

public sealed record InvoiceDto
{
    public int Id { get; }
    public string Type { get; }
    public DateTime InvoiceDate { get; }
    public DateTime? DueDate { get; }
    public string Status { get; }
    public decimal TotalAmount { get; }
    public int? PurchaseOrderId { get; }
    public int? SalesOrderId { get; }
}

