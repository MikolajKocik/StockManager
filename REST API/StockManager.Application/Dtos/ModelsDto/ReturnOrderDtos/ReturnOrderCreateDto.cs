using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderDtos;

public sealed record ReturnOrderCreateDto
{
    public required string Type { get; init; }
    public DateTime ReturnDate { get; init; }
    public int? PurchaseOrderId { get; init; }
    public int? SalesOrderId { get; init; }
}
