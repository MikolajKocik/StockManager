using System;

namespace StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

public sealed record ReorderRuleCreateDto
{
    public int ProductId { get; init; }
    public required string Warehouse { get; init; }
    public decimal MinLevel { get; init; }
    public decimal MaxLevel { get; init; }
}
