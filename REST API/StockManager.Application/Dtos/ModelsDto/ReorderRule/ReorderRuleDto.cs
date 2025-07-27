using System;

namespace StockManager.Application.Dtos.ModelsDto.ReorderRule;

public sealed record ReorderRuleDto
{
    public int Id { get; }
    public int ProductId { get; }
    public string? ProductName { get; }
    public string Warehouse { get; }
    public decimal MinLevel { get; }
    public decimal MaxLevel { get; }
}
