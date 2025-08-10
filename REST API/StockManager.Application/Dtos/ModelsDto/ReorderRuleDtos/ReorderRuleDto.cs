using System;

namespace StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

public sealed record ReorderRuleDto
{
    public int Id { get; init; }
    public int ProductId { get; init; }
    public string? ProductName { get; init; }
    public required string Warehouse { get; init; }
    public decimal MinLevel { get; init; }
    public decimal MaxLevel { get; init; }
}
