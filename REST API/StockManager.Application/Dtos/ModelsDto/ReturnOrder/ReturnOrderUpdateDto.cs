using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrder;

public sealed record ReturnOrderUpdateDto
{
    public int Id { get; init; }
    public string? Type { get; init; }
    public string? Status { get; init; }
    public DateTime? ReturnDate { get; init; }
    public int? PurchaseOrderId { get; init; }
    public int? SalesOrderId { get; init; }
}
